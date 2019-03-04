import { Role } from 'testcafe'
import { driveUser } from '../helpers/roles'
import {
  deleteLocalFile,
  checkLocalFile,
  setDownloadPath,
  TESTCAFE_DRIVE_URL
} from '../helpers/utils'
import DrivePage from '../pages/drive-model'
import PublicDrivePage from '../pages/drive-model-public'

let data = require('../helpers/data')
const drivePage = new DrivePage()
const publicDrivePage = new PublicDrivePage()

//************************
//Tests when authentified
//************************
fixture`File link Sharing Scenario`.page`${TESTCAFE_DRIVE_URL}/`
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Loggin & Initialization`)
    await t.useRole(driveUser)
    await drivePage.waitForLoading()
    console.groupEnd()
  })
  .afterEach(async () => {
    console.groupEnd()
  })

test('Drive : Create a $test_date_time folder in Drive', async () => {
  console.group(`↳ ℹ️  Drive : Create a ${data.FOLDER_DATE_TIME} folder`)
  await drivePage.addNewFolder(data.FOLDER_DATE_TIME)
  //We need to pass data.FOLDER_DATE_TIME through multiple fixture, so we cannot use ctx here.
})

test('Drive : from Drive, go in a folder, upload a file, and share the file', async t => {
  console.group(
    `↳ ℹ️  Drive : Go into ${
      data.FOLDER_DATE_TIME
    }, upload a file, and share the file`
  )
  await drivePage.goToFolder(data.FOLDER_DATE_TIME)
  await drivePage.openActionMenu()
  await t.pressKey('esc') //close action Menu

  await drivePage.uploadFiles([`${data.FILE_FROM_ZIP_PATH}/${data.FILE_XLSX}`])
  await drivePage.shareFirstFilePublicLink()

  const link = await drivePage.copyBtnShareByLink.getAttribute('data-test-url')
  if (link) {
    data.sharingLink = link
    console.log(`SHARING_LINK : ` + data.sharingLink)
  }
})

//************************
// Public (no authentification)
//************************
fixture`Drive : Access a file public link, download the file, and check the 'create Cozy' link`
  .page`${TESTCAFE_DRIVE_URL}/`
  .beforeEach(async t => {
    console.group(
      `\n↳ ℹ️  no Loggin (anonymous) & DOWNLOAD_PATH initialization`
    )
    await t.useRole(Role.anonymous())
    await setDownloadPath(data.DOWNLOAD_PATH)
    console.groupEnd()
  })
  .afterEach(async () => {
    await checkLocalFile(`${data.DOWNLOAD_PATH}/${data.FILE_XLSX}`) //The file is downloaded directly, no zip!
    await deleteLocalFile(`${data.DOWNLOAD_PATH}/${data.FILE_XLSX}`)
    console.groupEnd()
  })
test(`[Desktop] Drive : Access a file public link, download the file, and check the 'create Cozy' link`, async t => {
  console.group(
    `↳ ℹ️ [Desktop] Drive : Access a file public link, download the file, and check the 'create Cozy' link`
  )
  await t.navigateTo(data.sharingLink)
  await publicDrivePage.waitForViewer()

  await publicDrivePage.checkActionMenuPublicDesktop('file')
  await t
    .setNativeDialogHandler(() => true)
    .click(publicDrivePage.btnPublicDownload)
    .click(publicDrivePage.btnPublicCreateCozyFile)
  await publicDrivePage.checkCreateCozy()
})

test(`[Mobile] Drive : Access a file public link, download the file, and check the 'create Cozy' link`, async t => {
  console.group(
    `↳ ℹ️ [Mobile] Drive : Access a file public link, download the file, and check the 'create Cozy' link`
  )
  await t.resizeWindowToFitDevice('iPhone 6', {
    portraitOrientation: true
  })
  await t.navigateTo(data.sharingLink)
  await publicDrivePage.waitForViewer()

  await publicDrivePage.checkActionMenuPublicMobile('file')
  await t
    .setNativeDialogHandler(() => true)
    .click(publicDrivePage.btnPublicMobileDownload)
    .click(publicDrivePage.btnPublicMoreMenuFile) //need to re-open the more menu
    .click(publicDrivePage.btnPublicMobileCreateCozy)
  await publicDrivePage.checkCreateCozy()

  await t.maximizeWindow() //Back to desktop
})

//************************
//Tests when authentified
//************************
fixture`Drive : Unshare public link`.page`${TESTCAFE_DRIVE_URL}/`
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Loggin & Initialization`)
    await t.useRole(driveUser)
    await drivePage.waitForLoading()
    console.groupEnd()
  })
  .afterEach(async () => {
    console.groupEnd()
  })

test('Unshare file', async () => {
  console.group('↳ ℹ️  Unshare file')
  await drivePage.goToFolder(data.FOLDER_DATE_TIME)
  await drivePage.unshareFirstFilePublicLink()
})

//************************
// Public (no authentification)
//************************
fixture`Drive : No Access to an old file public link`
  .page`${TESTCAFE_DRIVE_URL}/`
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  no Loggin (anonymous)`)
    await t.useRole(Role.anonymous())
    console.groupEnd()
  })
  .afterEach(async () => {
    console.groupEnd()
  })
test('Drive : No Access to an old file public link', async t => {
  console.group('↳ ℹ️  Drive : No Access to an old file public link')
  await t.navigateTo(data.sharingLink)

  await publicDrivePage.waitForLoading()
  await publicDrivePage.checkNotAvailable()
})

//************************
//Tests when authentified
//************************
fixture`Test clean up : remove files and folders`.page`${TESTCAFE_DRIVE_URL}/`
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Loggin & Initialization`)
    await t.useRole(driveUser)
    await drivePage.waitForLoading()
    console.groupEnd()
  })
  .afterEach(async () => {
    console.groupEnd()
  })
test('(filesharing) Delete File, and foler', async () => {
  console.group('↳ ℹ️  Drive : Delete File, and foler')
  await drivePage.goToFolder(data.FOLDER_DATE_TIME)
  await drivePage.deleteElementByName(data.FILE_XLSX)
  await drivePage.deleteCurrentFolder()
})
