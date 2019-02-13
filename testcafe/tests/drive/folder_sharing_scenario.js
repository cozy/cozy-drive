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
fixture`Folder link Sharing Scenario`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(
  async t => {
    await t.useRole(driveUser)
    await drivePage.waitForLoading()
  }
)

test('Drive : Create a $test_date_time folder in Drive', async () => {
  await drivePage.addNewFolder(data.FOLDER_DATE_TIME)
  //We need to pass data.FOLDER_DATE_TIME through multiple fixture, so we cannot use ctx here.
})

test('Drive : from Drive, go in a folder, upload a file, and share the folder', async t => {
  await drivePage.goToFolder(data.FOLDER_DATE_TIME)
  await drivePage.openActionMenu()
  await t.pressKey('esc') //close action Menu
  await drivePage.uploadFiles([`${data.DATA_PATH}${data.FILE_PDF}`])
  await drivePage.shareFolderPublicLink()

  const link = await drivePage.copyBtnShareByLink.getAttribute('data-test-url')
  if (link) {
    data.sharingLink = link
    console.log(`data.sharingLink : ` + data.sharingLink)
  }
})

//************************
// Public (no authentification)
//************************
fixture`Drive : Access a folder public link, download the file(s), and check the 'create Cozy' link`
  .page`${TESTCAFE_DRIVE_URL}/`
  .beforeEach(async t => {
    await t.useRole(Role.anonymous())
    await setDownloadPath(data.DOWNLOAD_PATH)
  })
  .afterEach(async () => {
    await checkLocalFile(data.DOWNLOAD_ZIP_PATH)
    await deleteLocalFile(data.DOWNLOAD_ZIP_PATH)
  })
test(`[Desktop] Drive : Access a folder public link, download the file(s), and check the 'create Cozy' link`, async t => {
  await t.navigateTo(data.sharingLink)
  await publicDrivePage.waitForLoading()

  await publicDrivePage.checkActionMenuPublicDesktop('folder')
  await t
    .wait(3000) //!FIXME to remove after https://trello.com/c/IZfev6F1/1658-drive-public-share-impossible-de-t%C3%A9l%C3%A9charger-le-fichier is fixed
    .setNativeDialogHandler(() => true)
    .click(publicDrivePage.btnPublicDownload)
    .click(publicDrivePage.btnPublicCreateCozyFolder)
  await publicDrivePage.checkCreateCozy()
})

test(`[Mobile] Drive : Access a folder public link, download the file(s), and check the 'create Cozy' link`, async t => {
  await t.resizeWindowToFitDevice('iPhone 6', {
    portraitOrientation: true
  })
  await t.navigateTo(data.sharingLink)
  await publicDrivePage.waitForLoading()
  await publicDrivePage.checkActionMenuPublicMobile('folder')
  await t
    .wait(3000) //!FIXME to remove after https://trello.com/c/IZfev6F1/1658-drive-public-share-impossible-de-t%C3%A9l%C3%A9charger-le-fichier is fixed
    .setNativeDialogHandler(() => true)
    .click(publicDrivePage.btnPublicMobileDownload)
    .click(publicDrivePage.btnPublicMoreMenuFolder) //need to re-open the more menu
    .click(publicDrivePage.btnPublicMobileCreateCozy)
  await publicDrivePage.checkCreateCozy()

  await t.maximizeWindow() //Back to desktop
})

//************************
//Tests when authentified
//************************
fixture`Drive : Unshare public link`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(
  async t => {
    await t.useRole(driveUser)
    await drivePage.waitForLoading()
  }
)
test('Unshare foler', async () => {
  await drivePage.goToFolder(data.FOLDER_DATE_TIME)
  await drivePage.unshareFolderPublicLink()
})

//************************
// Public (no authentification)
//************************
fixture`Drive : No Access to an old folder public link`
  .page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  await t.useRole(Role.anonymous())
})
test('`Drive : No Access to an old folder public link', async t => {
  await t.navigateTo(data.sharingLink)

  await publicDrivePage.waitForLoading()
  await publicDrivePage.checkNotAvailable()
})

//************************
//Tests when authentified
//************************
fixture`Test clean up : remove files and folders`
  .page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  await t.useRole(driveUser)
  await drivePage.waitForLoading()
})
test('Delete File, and foler', async () => {
  await drivePage.goToFolder(data.FOLDER_DATE_TIME)
  await drivePage.deleteElementByName(data.FILE_PDF)
  await drivePage.deleteCurrentFolder()
})
