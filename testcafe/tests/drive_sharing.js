import { Selector, Role } from 'testcafe'
import { driveUser } from './helpers/roles'
import {
  TESTCAFE_DRIVE_URL,
  FOLDER_DATE_TIME,
  isExistingAndVisibile,
  getCurrentDateTime
} from './helpers/utils'

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
  await drivePage.shareFolderPublicLink() //-> Not finish
})

//************************
// Public (no authentification)
//************************
fixture`Drive : Access a folder public link`
  .page`${TESTCAFE_DRIVE_URL}/`.beforeEach(async t => {
  await t.useRole(Role.anonymous())
})
test('Drive : Access a folder public link', async t => {
  await t.navigateTo(
    'http://drive.cozy.tools:8080/public?sharecode=t2dqusHt2GFf'
  ) //!// FIXME: :use URL from copy-paste
  await publicDrivePage.waitForLoading()

  await publicDrivePage.checkActionMenuPublicDesktop()
  await t
    .setNativeDialogHandler(() => true)
    .click(publicDrivePage.btnPublicDownload)
    .click(publicDrivePage.btnPublicCreateCozy)
  await publicDrivePage.checkCreateCozy()

  //there is some errors if I check for file just after cliking the download button, but not if we do it at the end.
  await publicDrivePage.checkDownload('files.zip')

  //Mobiles Checks
  await t.resizeWindowToFitDevice('iPhone 6', {
    portraitOrientation: true
  })
  await publicDrivePage.checkActionMenuPublicMobile()
  await t
    .setNativeDialogHandler(() => true)
    .click(publicDrivePage.btnPublicMobileDownload)
    .click(publicDrivePage.btnPublicMoreMenu) //need to re-open the more menu
    .click(publicDrivePage.btnPublicMobileCreateCozy)
  await publicDrivePage.checkCreateCozy()

  await publicDrivePage.checkDownload('files (1).zip')

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
  await t.navigateTo(
    'http://drive.cozy.tools:8080/public?sharecode=Ueoxcqmt9Ve7'
  ) //!// FIXME: :use URL from copy-paste
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
