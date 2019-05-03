import { photosUser } from '../helpers/roles' //import roles for login
import { TESTCAFE_PHOTOS_URL, SLUG } from '../helpers/utils'
import { initVR } from '../helpers/visualreview-utils'
import Viewer from '../pages/photos-viewer/photos-viewer-model'
import Timeline from '../pages/photos/photos-timeline-model'
import * as selectors from '../pages/selectors'
import { maskPhotosCluster } from '../helpers/data'
const timelinePage = new Timeline()
const photoViewer = new Viewer()

//Scenario const
const FEATURE_PREFIX = 'PhotosCrud'
const FIXTURE_INIT = `${FEATURE_PREFIX} 1- Photos Navigation`
const TEST_SELECT1 = `1-1 Select 1 photo`
const TEST_SELECT2 = `1-2 Select 3 photos`
const TEST_VIEWER_FIRST = `1-1 Open viewer for 1st photo`
const TEST_VIEWER_LAST = `1-1 Open viewer for last photo`
const TEST_VIEWER_OTHER = `1-1 Open viewer for 2nd photo`

fixture`${FIXTURE_INIT}`.page`${TESTCAFE_PHOTOS_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_INIT)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.useRole(photosUser)
    await timelinePage.waitForLoading()
    await timelinePage.initPhotosCount()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_SELECT1, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_SELECT1}`)
  //Selection bar shows up. It includes AddtoAlbun, Download and Delete buttons
  await timelinePage.selectPhotos(1)
  await timelinePage.checkCozyBarOnTimeline()
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_SELECT1}-1`,
    withMask: maskPhotosCluster
  })
  console.groupEnd()
})

test(TEST_SELECT2, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_SELECT2}`)
  //Selection bar shows up. It includes AddtoAlbun, Download and Delete buttons
  await timelinePage.selectPhotos(3)
  await timelinePage.checkCozyBarOnTimeline()
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_SELECT2}-1`,
    withMask: maskPhotosCluster
  })
  console.groupEnd()
})

test(TEST_VIEWER_FIRST, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_VIEWER_FIRST}`)
  //Right arrow shows up. Navigation to other pics is OK, Closing pic (X or 'esc') is Ok
  await photoViewer.openPhotoFullscreen(0)
  await t.hover(selectors.viewerControls, {
    offsetX: 0,
    offsetY: 0
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_VIEWER_FIRST}-1`
  })
  await photoViewer.navigateToNextFile(0)
  await photoViewer.closeViewer({
    exitWithEsc: true
  })
  await photoViewer.openPhotoFullscreen(0)
  await photoViewer.navigateToPrevFile(0)
  await photoViewer.closeViewer({
    exitWithEsc: false
  })
  console.groupEnd()
})

test(TEST_VIEWER_LAST, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_VIEWER_LAST}`)
  //Left arrow shows up. Navigation to other pics is OK, Closing pic (X or 'esc') is Ok
  await photoViewer.openPhotoFullscreen(t.ctx.totalFilesCount - 1)
  await t.hover(selectors.viewerControls, {
    offsetX: 0,
    offsetY: 0
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_VIEWER_LAST}-1`
  })
  await photoViewer.navigateToNextFile(t.ctx.totalFilesCount - 1)
  await photoViewer.closeViewer({
    exitWithEsc: true
  })
  await photoViewer.openPhotoFullscreen(t.ctx.totalFilesCount - 1)
  await photoViewer.navigateToPrevFile(t.ctx.totalFilesCount - 1)
  await photoViewer.closeViewer({
    exitWithEsc: false
  })
  console.groupEnd()
})

test(TEST_VIEWER_OTHER, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_VIEWER_OTHER}`)
  //Both arrows show up. Navigation to other pics is OK, Closing pic (X or 'esc') is Ok
  await photoViewer.openPhotoFullscreen(1)
  await t.hover(selectors.viewerControls, {
    offsetX: 0,
    offsetY: 0
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_VIEWER_OTHER}-1`
  })
  await photoViewer.navigateToNextFile(1)
  await photoViewer.closeViewer({
    exitWithEsc: true
  })
  await photoViewer.openPhotoFullscreen(1)
  await photoViewer.navigateToPrevFile(1)
  await photoViewer.closeViewer({
    exitWithEsc: false
  })
  console.groupEnd()
})
