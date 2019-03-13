import { ClientFunction, Selector, t } from 'testcafe'
import fs from 'fs-extra'
import path from 'path'
import unzipper from 'unzipper'
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

//Returns the URL of the current web page
export const getPageUrl = ClientFunction(() => window.location.href)

export const goBack = ClientFunction(() => window.history.back())

export const getNavigatorOs = ClientFunction(() => navigator.platform)

//User Agent is needed for VisualReview, but we don't need the all string
export const getNavigatorName = ClientFunction(() => {
  let navigatorKey = ['MSIE', 'Firefox', 'Safari', 'Chrome', 'Opera'],
    userAgent = navigator.userAgent,
    index = navigatorKey.length - 1
  for (
    index;
    index > -1 && userAgent.indexOf(navigatorKey[index]) === -1;
    index--
  );
  return navigatorKey[index]
})

export const getResolution = ClientFunction(
  () => `${window.screen.width} x ${window.screen.height}`
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
    .ok(`'${selectorName}' doesnt exist`)
    .expect(selector.visible)
    .ok(`'${selectorName}' is not visible`)
  console.log(` - '${selectorName}' exists and is visible!`)
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
export async function checkLocalFile(filepath) {
  await t.expect(fs.existsSync(filepath)).ok(`${filepath} doesn't exist`)
  console.log(`${filepath} exists on local drive`)
}
//@param{string} filepath : Expected full path to file
export async function deleteLocalFile(filepath) {
  fs.unlink(filepath, function(err) {
    if (err) throw err
    // if no error, file has been deleted successfully
    console.log(`${filepath} deleted`)
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
  let requestsCount = 0
  let statuses = []

  const getRequestResult = ClientFunction(url => {
    return new Promise(resolve => {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.onload = function() {
        resolve(xhr.status)
      }
      xhr.send(null)
    })
  })

  for (let i = 0; i < count; i++) {
    let url = await images.nth(i).getAttribute('src')
    requestsCount++
    statuses.push(await getRequestResult(url))
  }

  await t.expect(requestsCount).eql(statuses.length)
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
  } catch (error) {
    console.error(
      `↳ ❌ Unable to extract app archive. Is unzipper installed as a dependency ? Error : ${
        error.message
      }`
    )
    throw new Error('Unable to extract archive')
  }
}
