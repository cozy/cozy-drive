//import { Role } from 'testcafe'
import logger from '../helpers/logger'
import { driveUser } from '../helpers/roles'
import {
  deleteLocalFile,
  checkLocalFile,
  setDownloadPath,
  TESTCAFE_DRIVE_URL
} from '../helpers/utils'
import PrivateDrivePage from '../pages/drive/drive-model-private'
import PublicDrivePage from '../pages/drive/drive-model-public'
import PublicViewerPage from '../pages/drive-viewer/drive-viewer-model-public'
import * as selectors from '../pages/selectors'

let data = require('../helpers/data')
const privateDrivePage = new PrivateDrivePage()
const publicDrivePage = new PublicDrivePage()
const publicViewerPage = new PublicViewerPage()

//************************
//Tests when authentified
//************************
fixture`File link Sharing Scenario`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(
  async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  }
)

test('Drive : Create a $test_date_time folder in Drive', async () => {
  console.group(`↳ ℹ️  Drive : Create a ${data.FOLDER_DATE_TIME} folder`)
  await privateDrivePage.addNewFolder({ newFolderName: data.FOLDER_DATE_TIME })
  //We need to pass data.FOLDER_DATE_TIME through multiple fixture, so we cannot use ctx here.
  console.groupEnd()
})

test('Drive : from Drive, go in a folder, upload a file, and share the file', async t => {
  console.group(
    `↳ ℹ️  Drive : Go into ${
      data.FOLDER_DATE_TIME
    }, upload a file, and share the file`
  )
  await privateDrivePage.goToFolder(data.FOLDER_DATE_TIME)
  await privateDrivePage.openActionMenu()
  await t.pressKey('esc') //close action Menu

  await privateDrivePage.uploadFiles([
    `${data.FILE_FROM_ZIP_PATH}/${data.FILE_XLSX}`
  ])
  await privateDrivePage.shareFirstFilePublicLink()

  const link = await selectors.btnCopyShareByLink.getAttribute('data-test-url')
  if (link) {
    data.sharingLink = link
    logger.debug(`data.sharingLink : ` + data.sharingLink)
  }
  console.groupEnd()
})

//************************
// Public (no authentification)
//************************
fixture`Drive : Access a file public link, download the file, and check the 'create Cozy' link`
  .page`${TESTCAFE_DRIVE_URL}/`
  .beforeEach(async () => {
    console.group(
      `\n↳ ℹ️  no Loggin (anonymous) & DOWNLOAD_PATH initialization`
    )
    //await t.useRole(Role.anonymous())
    await setDownloadPath(data.DOWNLOAD_PATH)
    console.groupEnd()
  })
  .afterEach(async () => {
    await checkLocalFile(`${data.DOWNLOAD_PATH}/${data.FILE_XLSX}`) //The file is downloaded directly, no zip!
    await deleteLocalFile(`${data.DOWNLOAD_PATH}/${data.FILE_XLSX}`)
  })
test(`[Desktop] Drive : Access a file public link, download the file, and check the 'create Cozy' link`, async t => {
  console.group(
    `↳ ℹ️ [Desktop] Drive : Access a file public link, download the file, and check the 'create Cozy' link`
  )
  await t.navigateTo(data.sharingLink)
  await publicViewerPage.waitForLoading()

  await publicDrivePage.checkActionMenuPublicDesktop('file')
  await t
    .setNativeDialogHandler(() => true)
    .click(selectors.btnPublicDownloadDrive)
    .click(selectors.btnViewerPublicCreateCozy)
  await publicDrivePage.checkCreateCozy()
  await publicViewerPage.waitForLoading()

  console.groupEnd()
})

test(`[Mobile] Drive : Access a file public link, download the file, and check the 'create Cozy' link`, async t => {
  console.group(
    `↳ ℹ️ [Mobile] Drive : Access a file public link, download the file, and check the 'create Cozy' link`
  )
  await t.resizeWindowToFitDevice('iPhone 6', {
    portraitOrientation: true
  })
  await t.navigateTo(data.sharingLink)
  await publicViewerPage.waitForLoading()

  await publicDrivePage.checkActionMenuPublicMobile('file')
  await t
    .setNativeDialogHandler(() => true)
    .click(selectors.btnPublicMobileDownload)
    .click(selectors.btnMoreMenu) //need to re-open the more menu
    .click(selectors.btnPublicMobileCreateCozy)
  await publicDrivePage.checkCreateCozy()
  await publicViewerPage.waitForLoading()

  await t.maximizeWindow() //Back to desktop
  console.groupEnd()
})

//************************
//Tests when authentified
//************************
fixture`Drive : Unshare public link`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(
  async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  }
)

test('Unshare file', async () => {
  console.group('↳ ℹ️  Unshare file')
  await privateDrivePage.goToFolder(data.FOLDER_DATE_TIME)
  await privateDrivePage.unshareFirstFilePublicLink()
  console.groupEnd()
})

//************************
// Public (no authentification)
//************************
fixture`Drive : No Access to an old file public link`
  .page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async () => {
  console.group(`\n↳ ℹ️  no Loggin (anonymous)`)
  //await t.useRole(Role.anonymous())
  console.groupEnd()
})

test('Drive : No Access to an old file public link', async t => {
  console.group('↳ ℹ️  Drive : No Access to an old file public link')
  await t.navigateTo(data.sharingLink)

  await publicDrivePage.waitForLoading({ isNotAvailable: true })
  await publicDrivePage.checkNotAvailable()
  console.groupEnd()
})

//************************
//Tests when authentified
//************************
fixture`Test clean up : remove files and folders`
  .page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  console.group(`\n↳ ℹ️  Login & Initialization`)
  await t.useRole(driveUser)
  await privateDrivePage.waitForLoading()
  console.groupEnd()
})

test('(filesharing) Delete File, and foler', async () => {
  console.group('↳ ℹ️  Drive : Delete File, and foler')
  await privateDrivePage.goToFolder(data.FOLDER_DATE_TIME)
  await privateDrivePage.deleteElementByName(data.FILE_XLSX)
  await privateDrivePage.deleteCurrentFolder({})
  console.groupEnd()
})
