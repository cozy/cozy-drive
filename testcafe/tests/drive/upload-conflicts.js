import { TESTCAFE_DRIVE_URL, SLUG } from '../helpers/utils'
import {
  FILE_FROM_ZIP_PATH,
  FOLDER_NAME,
  THUMBNAIL_DELAY,
  maskDriveFolderWithDate,
  FILE_PDF
} from '../helpers/data'
import { driveUser } from '../helpers/roles'
import { initVR } from '../helpers/visualreview-utils'
import PrivateDrivePage from '../pages/drive/drive-model-private'
import * as selectors from '../pages/selectors'

const privateDrivePage = new PrivateDrivePage()

const FEATURE_PREFIX = 'UploadConflicts'

const FIXTURE_INIT = `${FEATURE_PREFIX} 1- Upload Data`
const TEST_CONFLICT_UPLOAD = `1-1 Upload a file that is already on drive`

//************************
//Tests when authentified
//************************
fixture`${FIXTURE_INIT}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_INIT)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.maximizeWindow()

    await t.useRole(driveUser)
    await privateDrivePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_CONFLICT_UPLOAD, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_CONFLICT_UPLOAD}`)
  await privateDrivePage.goToFolder(FOLDER_NAME)

  await privateDrivePage.uploadFiles([`${FILE_FROM_ZIP_PATH}/${FILE_PDF}`])

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CONFLICT_UPLOAD}-Divupload`,
    selector: selectors.divUpload
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CONFLICT_UPLOAD}-UploadAfter`,
    delay: THUMBNAIL_DELAY,
    withMask: maskDriveFolderWithDate,
    pageToWait: privateDrivePage
  })

  console.groupEnd()
})
