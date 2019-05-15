import { FOLDER_NAME } from '../helpers/data'
import { checkToastAppearsAndDisappears } from '../pages/commons'
import { driveUser } from '../helpers/roles'
import { TESTCAFE_DRIVE_URL, SLUG } from '../helpers/utils'
import { initVR } from '../helpers/visualreview-utils'
import { maskDriveFolderWithDate, maskDeleteFolder } from '../helpers/data'
import PrivateDrivePage from '../pages/drive/drive-model-private'

const privateDrivePage = new PrivateDrivePage()

const FIXTURE_CLEANUP = `Cleanup Data`
const TEST_DELETE_FOLDER = `1-1 Delete Folder`

//************************
//Tests when authentified - Clean up
//************************
fixture`${FIXTURE_CLEANUP}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_CLEANUP)
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

test(TEST_DELETE_FOLDER, async t => {
  console.group(`↳ ℹ️  ${FIXTURE_CLEANUP} : ${TEST_DELETE_FOLDER}`)
  await privateDrivePage.goToFolder(FOLDER_NAME)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FIXTURE_CLEANUP}/${TEST_DELETE_FOLDER}-1`,
    withMask: maskDriveFolderWithDate
  })

  await privateDrivePage.deleteCurrentFolder({
    screenshotPath: `${FIXTURE_CLEANUP}/${TEST_DELETE_FOLDER}-2`,
    withMask: maskDeleteFolder
  })

  await checkToastAppearsAndDisappears(
    'The selection has been moved to the Trash.'
  )
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FIXTURE_CLEANUP}/${TEST_DELETE_FOLDER}-3`
  })
  console.groupEnd()
})
