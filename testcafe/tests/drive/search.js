import { driveUser } from '../helpers/roles'
import {
  TESTCAFE_DRIVE_URL,
  SLUG,
  isExistingAndVisible
} from '../helpers/utils'
import { initVR } from '../helpers/visualreview-utils'
import { FOLDER_NAME, maskDriveFolderWithDate } from '../helpers/data'
import * as selectors from '../pages/selectors'
import PrivateDrivePage from '../pages/drive/drive-model-private'
//import ViewerDrivePage from '../pages/drive-viewer/drive-viewer-model'

const privateDrivePage = new PrivateDrivePage()
//const viewerDrivePage = new ViewerDrivePage()

//Scenario const
const FEATURE_PREFIX = 'Search'
const TEST_SEARCH1 = `1-1 Search letters (files)`
const TEST_SEARCH2 = `1-2 Search letters (folder)`
const TEST_SEARCH3 = `1-3 Search inside folder`
const TEST_SEARCH_NO_RESULT = `1-4 Search no result`

//************************
//Tests when authentified
//************************
fixture`${FEATURE_PREFIX}`.page`${TESTCAFE_DRIVE_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FEATURE_PREFIX)
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

test(TEST_SEARCH1, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_SEARCH1}`)
  await privateDrivePage.typeInSearchInput('at')
  await privateDrivePage.checkSearchResultCount(3)

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_SEARCH1}-AT`
  })

  await privateDrivePage.typeInSearchInput('i')
  await privateDrivePage.checkSearchResultCount(2)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_SEARCH1}-I`
  })

  await privateDrivePage.openSearchResultByIndex(0)
  // uncomment the following lines when https://trello.com/c/N8kFROf3 is fixed
  // await viewerDrivePage.waitForLoading()
  // await t.fixtureCtx.vr.takeScreenshotAndUpload({
  //   screenshotPath: `${FEATURE_PREFIX}/${TEST_SEARCH1}-viewer`
  // })
  await console.groupEnd()
})

test(TEST_SEARCH2, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_SEARCH2}`)
  await privateDrivePage.typeInSearchInput('cozy')
  await privateDrivePage.checkSearchResultCount(4)

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_SEARCH1}-Cozy`
  })

  await privateDrivePage.typeInSearchInput(' pho')
  await privateDrivePage.checkSearchResultCount(1)

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_SEARCH1}-Pho`
  })

  await t.pressKey('down')
  await t.pressKey('enter')
  await privateDrivePage.waitForLoading()
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_SEARCH2}-InsideFolder`
  })
  await console.groupEnd()
})

test(TEST_SEARCH3, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_SEARCH3}`)
  await privateDrivePage.goToFolder(FOLDER_NAME)
  await privateDrivePage.typeInSearchInput('tes im')
  await privateDrivePage.checkSearchResultCount(7)

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_SEARCH3}-TesIm`,
    withMask: maskDriveFolderWithDate
  })

  await t.pressKey('down')
  await t.pressKey('enter')
  // uncomment the following lines when https://trello.com/c/N8kFROf3 is fixed
  // await viewerDrivePage.waitForLoading()
  // await t.fixtureCtx.vr.takeScreenshotAndUpload({
  //   screenshotPath: `${FEATURE_PREFIX}/${TEST_SEARCH3}-viewer`
  // })
  await console.groupEnd()
})

test(TEST_SEARCH_NO_RESULT, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_SEARCH_NO_RESULT}`)
  await privateDrivePage.typeInSearchInput('qwerty')
  await isExistingAndVisible(`selectors.searchNoResult`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_SEARCH3}-Qwerty`,
    withMask: maskDriveFolderWithDate
  })
  await t.pressKey('esc')
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_SEARCH_NO_RESULT}-AfterEsc`
  })
  await console.groupEnd()
})
