import { ClientFunction, Selector, t } from 'testcafe'
import fs from 'fs'
import path from 'path'
import CDP from 'chrome-remote-interface'
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

export const getElementWithTestId = Selector(
  id => document.querySelectorAll(`[data-test-id='${id}']`)
  //getElementsByAttribute is not part of W3C DOM, while querySelectorAll is.
)

//It's best practice to check both exist and visible for an element
//!FIXME : add isExistingAndVisibile in photos_crud tests
export async function isExistingAndVisibile(selector, selectorName) {
  await t
    .expect(selector.exists)
    .ok(`'${selectorName}' doesnt exist`)
    .expect(selector.visible)
    .ok(`'${selectorName}' is not visible`)
  console.log(`'${selectorName}' exists and is visible!`)
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
