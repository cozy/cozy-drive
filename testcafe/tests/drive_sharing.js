import { Selector, Role } from 'testcafe'
import { driveUser } from './helpers/roles'
import {
  TESTCAFE_DRIVE_URL,
  getCurrentDateTime,
  FOLDER_DATE_TIME
} from './helpers/utils'
import Data from './helpers/data'
const data = new Data()

import DrivePage from './pages/drive-model'
const drivePage = new DrivePage()

import PublicDrivePage from './pages/drive-model-public'
const publicDrivePage = new PublicDrivePage()

const file = '[cozy]QA_table_ APPS.pdf'

//************************
//Tests when authentified
//************************
fixture`Folder link Sharing Scenario`.page`${TESTCAFE_DRIVE_URL}/`.beforeEach(
  async t => {
    await t.useRole(driveUser)
    await drivePage.waitForLoading()
  }
)

test('Drive : Create a $test_date_time folder in Drive', async t => {
  await drivePage.addNewFolder(FOLDER_DATE_TIME)
  //We need to pass FOLDER_DATE_TIME through multiple fixture, so we cannot use ctx here.
})

test('Drive : from Drive, go in a folder, upload a file, and share it', async t => {
  await drivePage.goToFolder(FOLDER_DATE_TIME)
  await drivePage.openActionMenu()
  await t.pressKey('esc') //close action Menu

  await drivePage.uploadFiles([`../data/${file}`])
  await drivePage.shareFolderPublicLink()

  const link = await drivePage.copyBtnShareByLink.getAttribute('data-test-url')
  if (link) {
    data.sharingLink = link
    console.log(`SHARING_LINK : ` + data.sharingLink)
  }
})

//************************
// Public (no authentification)
//************************
fixture`Drive : Access a folder public link`.page`${TESTCAFE_DRIVE_URL}/`
  .beforeEach(async t => {
    await t.useRole(Role.anonymous())
  })
  .afterEach(async t => {
    await publicDrivePage.checkLocalFile('files.zip')
    await publicDrivePage.deleteLocalFile('files.zip')
  })
test('Drive : Access a folder public link (desktop)', async t => {
  await t.navigateTo(data.sharingLink)
  await publicDrivePage.waitForLoading()

  await publicDrivePage.checkActionMenuPublicDesktop()
  await t
    .setNativeDialogHandler(() => true)
    .click(publicDrivePage.btnPublicDownload)
    .click(publicDrivePage.btnPublicCreateCozy)
  await publicDrivePage.checkCreateCozy()
})

test('Drive : Access a folder public link (mobile)', async t => {
  await t.resizeWindowToFitDevice('iPhone 6', {
    portraitOrientation: true
  })
  await t.navigateTo(data.sharingLink)
  await publicDrivePage.waitForLoading()
  await publicDrivePage.checkActionMenuPublicMobile()
  await t
    .setNativeDialogHandler(() => true)
    .click(publicDrivePage.btnPublicMobileDownload)
    .click(publicDrivePage.btnPublicMoreMenu) //need to re-open the more menu
    .click(publicDrivePage.btnPublicMobileCreateCozy)
  await publicDrivePage.checkCreateCozy()

  await t.resizeWindow(1280, 1024) //Back to desktop
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
test('Unshare foler', async t => {
  await drivePage.goToFolder(FOLDER_DATE_TIME)
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
test('Delete File, and foler', async t => {
  await drivePage.goToFolder(FOLDER_DATE_TIME)
  await drivePage.deleteElementByName(file)
  await drivePage.deleteCurrentFolder()
})
