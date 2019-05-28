import { ClientFunction, Selector, t } from 'testcafe'
import logger from './logger'

import fs from 'fs-extra'
import path from 'path'
import unzipper from 'unzipper'
import request from 'request'
import CDP from 'chrome-remote-interface'
let data = require('../helpers/data')

const INSTANCE_TESTCAFE = process.env.INSTANCE_TESTCAFE

export let TESTCAFE_PHOTOS_URL = ''
export let TESTCAFE_DRIVE_URL = ''

if (INSTANCE_TESTCAFE.includes('tools')) {
  //Local server
  const [cozy, env] = INSTANCE_TESTCAFE.split('.')
  TESTCAFE_PHOTOS_URL = `http://photos.${cozy}.${env}`
  TESTCAFE_DRIVE_URL = `http://drive.${cozy}.${env}`
} else {
  //not local server!
  const [instance, cozy, env] = INSTANCE_TESTCAFE.split('.')
  TESTCAFE_PHOTOS_URL = `https://${instance}-photos.${cozy}.${env}`
  TESTCAFE_DRIVE_URL = `https://${instance}-drive.${cozy}.${env}`
}

export const TESTCAFE_USER_PASSWORD = process.env.TESTCAFE_USER_PASSWORD

//SLUG is use for naming VR project. We want a different name when not using travis, to avoid removing usefull screenshots
export let SLUG = 'Local Testing'
if (
  typeof process.env.COZY_APP_SLUG !== 'undefined' &&
  process.env.COZY_APP_SLUG
) {
  SLUG = process.env.COZY_APP_SLUG
}
//Returns the URL of the current web page
export const getPageUrl = ClientFunction(() => window.location.href)

export const goBack = ClientFunction(() => window.history.back())

export const getNavigatorOs = ClientFunction(() => navigator.platform)

//User Agent is needed for VisualReview, but we don't need the all string
export const getNavigatorName = ClientFunction(() => {
  const navigatorKey = ['MSIE', 'Firefox', 'Safari', 'Chrome', 'Opera'],
    userAgent = navigator.userAgent
  return navigatorKey.find(
    navigatorName => userAgent.indexOf(navigatorName) !== -1
  )
})

export const getResolution = ClientFunction(
  () => `${window.innerWidth} x ${window.innerHeight}`
)

export const getElementWithTestId = Selector(
  id => document.querySelectorAll(`[data-test-id='${id}']`)
  //getElementsByAttribute is not part of W3C DOM, while querySelectorAll is.
)
export const getElementWithTestItem = Selector(
  id => document.querySelectorAll(`[data-test-item='${id}']`)
  //getElementsByAttribute is not part of W3C DOM, while querySelectorAll is.
)

//It's best practice to check both exist and visible for an element
export async function isExistingAndVisibile(selector, selectorName) {
  await t
    .expect(selector.exists)
    .ok(
      `'${selectorName}' doesnt exist - please check its definition in testcafe/tests/pages/selectors`
    )
    .expect(selector.visible)
    .ok(
      `'${selectorName}' exists, but is not visible - please check its definition in testcafe/tests/pages/selectors`
    )
  logger.debug(` - '${selectorName}' exists and is visible!`)
}

export function getCurrentDateTime() {
  let prettyCurrentDate = new Date()
    .toISOString()
    .substr(0, 19)
    .replace('T', '_')
    .replace(/[-:]+/g, '')
  return prettyCurrentDate
}

export const overwriteCopyCommand = ClientFunction(() => {
  document.execCommand = command => (window.lastExecutedCommand = command)
})

export const getLastExecutedCommand = ClientFunction(
  () => window.lastExecutedCommand
)

//@param{string} filepath : Expected full path to file
export async function checkLocalFile(t, filepath) {
  for (var i = 0; i < data.DOWNLOAD_CHECK_RETRIES; i++) {
    await t.wait(10)
    if (fs.existsSync(filepath)) {
      logger.info(
        `${filepath} exists on local drive. Waited for a total of ${i.toString()} milliseconds`
      )
      break
    }
  }
  //Will throw error if file was not download
  await t
    .expect(fs.existsSync(filepath))
    .ok(
      `${filepath} doesn't exist after ${
        data.DOWNLOAD_CHECK_RETRIES
      } milliseconds`
    )
}

//@param{string} filepath : Expected full path to file
export async function deleteLocalFile(filepath) {
  fs.unlink(filepath, function(err) {
    if (err) throw err
    // if no error, file has been deleted successfully
    logger.debug(`${filepath} deleted`)
  })
}

//Chrome:headless does not download file in the download Folder by default
//This function set the path for the download folder
export async function setDownloadPath(downloadFolderPath) {
  const client = await CDP()
  const { Network, Page } = client

  await Promise.all([Network.enable(), Page.enable()])

  await Page.setDownloadBehavior({
    behavior: 'allow',
    downloadPath: path.resolve(__dirname, downloadFolderPath)
  })
}
//Check http status for all img, to be sure everything is loaded before counting images
export async function checkAllImagesExists() {
  const images = Selector('img')
  let count = await images.count
  let location = await getPageUrl()
  let requestPromises = []

  for (let i = 0; i < count; i++) {
    let url = await images.nth(i).getAttribute('src')
    if (!url.startsWith('http')) url = location + url
    requestPromises.push(
      new Promise(resolve => {
        return request(location + url, function(error, response) {
          resolve(response ? response.statusCode : 0)
        })
      })
    )
  }
  let statuses = await Promise.all(requestPromises)
  for (const status of statuses) await t.expect(status).eql(200)
}

//Put all files path in an array for uploads
//@param { path } pathToFiles
export async function prepareFilesforViewerTest(pathToFiles) {
  fs.readdirSync(pathToFiles).forEach(file => {
    data.filesList.push(`${pathToFiles}/${file}`)
  })
}

//Put all files with (or without) ext in an array for testing viewer
//@param { path } filesPath : path to Files
//@param { array } ExtArray : array of extensions
export async function getFilesWithExt(filesPath, ExtArray) {
  let fileNameList = []
  fs.readdirSync(filesPath).forEach(file => {
    const fileNameChunks = file.split('.')
    const fileExt = fileNameChunks[fileNameChunks.length - 1]
    if (ExtArray.includes(fileExt.toLowerCase())) {
      fileNameList.push(`${file}`)
    }
  })
  return fileNameList
}
//Put all files without ext in an array for testing viewer
//@param { path } filesPath : path to Files
//@param { array } ExtArray : array of extensions
export async function getFilesWithoutExt(filesPath, ExtArray) {
  let fileNameList = []
  fs.readdirSync(filesPath).forEach(file => {
    const fileNameChunks = file.split('.')
    const fileExt = fileNameChunks[fileNameChunks.length - 1]
    if (!ExtArray.includes(fileExt.toLowerCase())) {
      fileNameList.push(`${file}`)
    }
  })
  return fileNameList
}

export async function extractZip(pathToZip, extractPath) {
  console.warn(`↳ ℹ️  Extracting archive ${pathToZip} into ${extractPath}`)
  try {
    await fs
      .createReadStream(pathToZip)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise()
      .then(() => logger.debug('data unzipped'), e => logger.error('error', e))
  } catch (error) {
    logger.error(
      `↳ ❌ Unable to extract app archive. Is unzipper installed as a dependency ? Error : ${
        error.message
      }`
    )
    throw new Error('Unable to extract archive')
  }
}
