import { photosUser } from '../helpers/roles'
import { TESTCAFE_PHOTOS_URL, SLUG } from '../helpers/utils'
import {
  maskPhotosCluster,
  DATA_PATH,
  IMG0,
  IMG1,
  IMG2,
  IMG3,
  IMG4,
  THUMBNAIL_DELAY
} from '../helpers/data'
import { initVR } from '../helpers/visualreview-utils'
import TimelinePage from '../pages/photos/photos-timeline-model'
import * as selectors from '../pages/selectors'
import logger from '../helpers/logger'

const timelinePage = new TimelinePage()

//Scenario const
const FEATURE_PREFIX = 'PhotosUpload'
const FIXTURE_INIT = `${FEATURE_PREFIX} 1- Upload Photos`
const TEST_UPLOAD1 = `1-1 Upload 1 photo`
const TEST_UPLOAD2 = `1-2 Upload 4 photos`

fixture`${FIXTURE_INIT}`.page`${TESTCAFE_PHOTOS_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_INIT)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.useRole(photosUser)
    await timelinePage.waitForLoading()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_UPLOAD1, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_UPLOAD1}`)
  await t.maximizeWindow() //Real fullscren for VR
  ///there is no photos on page
  await timelinePage.initPhotoCountZero()
  await timelinePage.uploadPhotos([`${DATA_PATH}/${IMG0}`])
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_UPLOAD1}-1-Divupload`,
    selector: selectors.divUpload
  })

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_UPLOAD1}-1`,
    delay: THUMBNAIL_DELAY,
    pageToWait: timelinePage
  })

  console.groupEnd()
})

test(TEST_UPLOAD2, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_UPLOAD2}`)
  await timelinePage.initPhotosCount()
  await timelinePage.uploadPhotos([
    `${DATA_PATH}/${IMG1}`,
    `${DATA_PATH}/${IMG2}`,
    `${DATA_PATH}/${IMG3}`,
    `${DATA_PATH}/${IMG4}`
  ])
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_UPLOAD1}-2-Divupload`,
    selector: selectors.divUpload
  })

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_UPLOAD1}-2`,
    withMask: maskPhotosCluster,
    delay: THUMBNAIL_DELAY,
    pageToWait: timelinePage
  })
  console.groupEnd()
})
