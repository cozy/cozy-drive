//import { Role } from 'testcafe'
import logger from '../helpers/logger'
import { driveUser } from '../helpers/roles'
import {
  deleteLocalFile,
  checkLocalFile,
  setDownloadPath,
  TESTCAFE_DRIVE_URL
} from '../helpers/utils'
import * as selectors from '../pages/selectors'
import PrivateDrivePage from '../pages/drive/drive-model-private'
import PublicDrivePage from '../pages/drive/drive-model-public'

let data = require('../helpers/data')
const privateDrivePage = new PrivateDrivePage()
const publicDrivePage = new PublicDrivePage()

//************************
//Tests when authentified
//************************
fixture`Folder link Sharing Scenario`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(
  async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.maximizeWindow()

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

test('Drive : from Drive, go in a folder, upload a file, and share the folder', async t => {
  console.group(
    `↳ ℹ️  Drive : Go into ${
      data.FOLDER_DATE_TIME
    }, upload a file, and share the folder`
  )
  await privateDrivePage.goToFolder(data.FOLDER_DATE_TIME)
  await privateDrivePage.openActionMenu()
  await t.pressKey('esc') //close action Menu
  await privateDrivePage.uploadFiles([
    `${data.FILE_FROM_ZIP_PATH}/${data.FILE_PDF}`
  ])
  await privateDrivePage.shareFolderPublicLink()

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
fixture`Drive : Access a folder public link, download the file(s), and check the 'create Cozy' link`
  .page`${TESTCAFE_DRIVE_URL}/`
  .beforeEach(async t => {
    console.group(
      `\n↳ ℹ️  no Loggin (anonymous) & DOWNLOAD_PATH initialization`
    )
    await t.maximizeWindow()

    //await t.useRole(Role.anonymous())
    await setDownloadPath(data.DOWNLOAD_PATH)
    console.groupEnd()
  })
  .afterEach(async t => {
    await checkLocalFile(t, data.DOWNLOAD_FOLDER_PATH)
    await deleteLocalFile(data.DOWNLOAD_FOLDER_PATH)
  })
test(`[Desktop] Drive : Access a folder public link, download the file(s), and check the 'create Cozy' link`, async t => {
  console.group(
    `↳ ℹ️ [Desktop] Drive : Access a folder public link, download the file, and check the 'create Cozy' link`
  )
  await t.navigateTo(data.sharingLink)
  await publicDrivePage.waitForLoading({ isNotAvailable: false, isFull: true })

  await publicDrivePage.checkActionMenuPublicDesktop('folder')
  await t
    .wait(3000) //!FIXME to remove after https://trello.com/c/IZfev6F1/1658-drive-public-share-impossible-de-t%C3%A9l%C3%A9charger-le-fichier is fixed
    .setNativeDialogHandler(() => true)
    .click(selectors.btnPublicDownloadDrive)
    .click(selectors.btnDrivePublicCreateCozy)
  await publicDrivePage.checkCreateCozy()
  await publicDrivePage.waitForLoading({ isNotAvailable: false, isFull: true })

  console.groupEnd()
})

test(`[Mobile] Drive : Access a folder public link, download the file(s), and check the 'create Cozy' link`, async t => {
  console.group(
    `↳ ℹ️ [Mobile] Drive : Access a folder public link, download the file, and check the 'create Cozy' link`
  )
  await t.resizeWindowToFitDevice('iPhone 6', {
    portraitOrientation: true
  })
  await t.navigateTo(data.sharingLink)
  await publicDrivePage.waitForLoading({ isNotAvailable: false, isFull: true })
  await publicDrivePage.checkDesktopElementsNotShowingOnMobile('folder')

  //Download
  await publicDrivePage.checkDownloadButtonOnMobile()
  await t
    .wait(3000) //!FIXME to remove after https://trello.com/c/IZfev6F1/1658-drive-public-share-impossible-de-t%C3%A9l%C3%A9charger-le-fichier is fixed
    .setNativeDialogHandler(() => true)
    .click(selectors.btnPublicMobileDownload)

  //create my cozy
  await publicDrivePage.checkCozyCreationButtonOnMobile()
  await t.click(selectors.btnPublicMobileCreateCozy)
  await publicDrivePage.checkCreateCozy()
  await publicDrivePage.waitForLoading({ isNotAvailable: false, isFull: true })

  console.groupEnd()
})

//************************
//Tests when authentified
//************************
fixture`Drive : Unshare public link`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(
  async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.maximizeWindow() //Back to desktop

    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  }
)

test('Unshare folder', async () => {
  console.group('↳ ℹ️  Unshare folder')
  await privateDrivePage.goToFolder(data.FOLDER_DATE_TIME)
  await privateDrivePage.unshareFolderPublicLink()
  console.groupEnd()
})

//************************
// Public (no authentification)
//************************
fixture`Drive : No Access to an old folder public link`
  .page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  console.group(`\n↳ ℹ️  no Loggin (anonymous)`)
  await t.maximizeWindow()

  //await t.useRole(Role.anonymous())
  console.groupEnd()
})

test('`Drive : No Access to an old folder public link', async t => {
  console.group('↳ ℹ️  Drive : No Access to an old folder public link')
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
  await t.maximizeWindow()

  await t.useRole(driveUser)
  await privateDrivePage.waitForLoading()
  console.groupEnd()
})

test('(foldersharing) Delete File, and foler', async () => {
  console.group('↳ ℹ️  Drive : Delete File, and foler')

  await privateDrivePage.goToFolder(data.FOLDER_DATE_TIME)
  await privateDrivePage.deleteElementByName(data.FILE_PDF)
  await privateDrivePage.deleteCurrentFolder({})
  console.groupEnd()
})
