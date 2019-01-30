#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const { spawn } = require('child_process')

const DOWNCLOUD_UPLOAD_DIR = 'www-upload/'
const DOWNCLOUD_URL = 'downcloud.cozycloud.cc'

const launchCmd = (cmd, params, options) => {
  return new Promise(async (resolve, reject) => {
    const result = { stdout: [], stderr: [] }
    const cmdOptions = { encoding: 'utf8', ...options }
    const process = await spawn(cmd, params, cmdOptions)
    process.stdout.on('data', data => result.stdout.push(data.toString()))
    process.stderr.on('data', data => result.stderr.push(data.toString()))
    process.on('close', code => {
      result.code = code
      if (code === 0) {
        resolve(result.stdout.join(''))
      } else {
        reject(new Error(result.stderr.join('')))
      }
    })
  })
}

const pushArchive = async (fileName, parentFolder, options) => {
  const { appSlug, appVersion, buildCommit } = options
  console.log(`↳ ℹ️  Sending archive to downcloud`)
  const folder = `${appSlug}/mobile/${appVersion}${
    buildCommit ? `-${buildCommit}` : ''
  }/`
  try {
    await launchCmd('ssh', [
      '-o',
      'StrictHostKeyChecking=no',
      'upload@downcloud.cozycloud.cc',
      `mkdir -p ${DOWNCLOUD_UPLOAD_DIR}${folder}`
    ])
  } catch (e) {
    throw new Error(
      `Unable to create target directory ${folder} on downcloud server : ${
        e.message
      }`
    )
  }

  await launchCmd(
    'rsync',
    [
      // to remove host validation question on CI
      '-e',
      'ssh -o StrictHostKeyChecking=no',
      '-a',
      fileName,
      `upload@${DOWNCLOUD_URL}:${DOWNCLOUD_UPLOAD_DIR}${folder}`
    ],
    { cwd: parentFolder }
  )

  console.log(`↳ ℹ️  Upload to downcloud complete.`)

  return {
    ...options,
    appBuildUrl: `https://${DOWNCLOUD_URL}/upload/${folder}${fileName}`
  }
}

const run = (async () => {
  try {
    const uploadTarget = process.argv[2]

    if (!fs.existsSync(uploadTarget)) {
      console.error(`↳ ❌ ${uploadTarget} does not exist.`)
      process.exit(1)
    }
    else {
      if (fs.lstatSync(uploadTarget).isDirectory()) {
        console.error(`↳ ❌ ${uploadTarget} is a directory.`)
        //@TODO: turn the directory into an archive and upload it, see https://github.com/cozy/cozy-libs/blob/master/packages/cozy-app-publish/lib/hooks/pre/downcloud.js#L113
        process.exit(1)
      }
      const uploadDir = path.dirname(uploadTarget)
      const uploadFile = path.basename(uploadTarget)

      const { version } = require('./package.json')

      const { appBuildUrl } = await pushArchive(uploadFile, uploadDir, {
        appSlug: process.env.COZY_APP_SLUG,
        appVersion: version,
        buildCommit: process.env.TRAVIS_COMMIT
      })
      console.log(`↳ ✅ Upload complete, APK available at ${appBuildUrl}`)

    }

  }
  catch (error) {
    console.error(`↳ ❌  Error while uploading: ${error.message}`)
    process.exit(1)
  }
})()
