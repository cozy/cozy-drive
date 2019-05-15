import {
  TESTCAFE_DRIVE_URL,
  SLUG,
  extractZip,
  prepareFilesforViewerTest
} from '../helpers/utils'
import {
  DATA_ZIP_PATH,
  DATA_PATH,
  FILE_FROM_ZIP_PATH,
  FOLDER_NAME,
  THUMBNAIL_DELAY,
  maskDriveFolderWithDate,
  filesList
} from '../helpers/data'
import { driveUser } from '../helpers/roles'
import { initVR } from '../helpers/visualreview-utils'
import PrivateDrivePage from '../pages/drive/drive-model-private'
import * as selectors from '../pages/selectors'

const privateDrivePage = new PrivateDrivePage()

const FEATURE_PREFIX = 'InitData'

const FEATURE_UNZIP = `${FEATURE_PREFIX} 1- Init files used in tests`
const TEST_UNZIP = `1-1 Unzip archive containing files used for testing`
const TEST_PREPARE = `1-2 Prepare the unzipped files for testing`

const FIXTURE_INIT = `${FEATURE_PREFIX} 2- Upload Data`
const TEST_CREATE_FOLDER = `2-1 Create Folder & Upload Files`

fixture`${FEATURE_UNZIP}`

test(TEST_UNZIP, async () => {
  await extractZip(DATA_ZIP_PATH, DATA_PATH)
})

test(TEST_PREPARE, async () => {
  //set path needed to use data in tests
  await prepareFilesforViewerTest(FILE_FROM_ZIP_PATH)
})

//************************
//Tests when authentified
//************************
fixture`${FIXTURE_INIT}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_INIT)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_CREATE_FOLDER, async t => {
  await t.maximizeWindow() //Real fullscren for VR
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_CREATE_FOLDER}`)
  await privateDrivePage.addNewFolder({
    newFolderName: `${FOLDER_NAME}`,
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-CreateBefore`
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-CreateAfter`
  })

  await privateDrivePage.goToFolder(FOLDER_NAME)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-UploadBefore`
  })
  await privateDrivePage.uploadFiles(filesList)

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-Divupload`,
    selector: selectors.divUpload
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_FOLDER}-UploadAfter`,
    delay: THUMBNAIL_DELAY,
    withMask: maskDriveFolderWithDate,
    pageToWait: privateDrivePage
  })

  console.groupEnd()
})
