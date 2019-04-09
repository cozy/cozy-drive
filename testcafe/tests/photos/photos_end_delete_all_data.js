import { photosUser } from '../helpers/roles'
import { TESTCAFE_PHOTOS_URL, SLUG } from '../helpers/utils'
import { IMG0, IMG1, IMG2, IMG3, IMG4 } from '../helpers/data'
import { VisualReviewTestcafe } from '../helpers/visualreview-utils'
import TimelinePage from '../pages/photos/photos-timeline-model'

const timelinePage = new TimelinePage()

//Scenario const
const FEATURE_PREFIX = 'PhotosDelete'
const FIXTURE_INIT = `${FEATURE_PREFIX} 1- Delete Photos`
const TEST_DELETE1 = `1-1 Delete 1 photo`
const TEST_DELETE2 = `1-2 Delete 4 photos`

fixture`${FIXTURE_INIT}`.page`${TESTCAFE_PHOTOS_URL}/`
  .before(async ctx => {
    ctx.vr = new VisualReviewTestcafe({
      projectName: `${SLUG}`,
      suiteName: `${FIXTURE_INIT}`
    })
    await ctx.vr.start()
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Loggin & Initialization`)
    await t.useRole(photosUser)
    await timelinePage.waitForLoading()
    await timelinePage.initPhotosCount()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(`${TEST_DELETE1}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_DELETE1}`)
  await timelinePage.selectPhotosByName([IMG0])
  //pic is removed
  await timelinePage.deletePhotosFromTimeline(1)

  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_DELETE1}-1`
  )
  console.groupEnd()
})

test(`${TEST_DELETE2}`, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_DELETE2}`)
  await timelinePage.selectPhotosByName([IMG1, IMG2, IMG3, IMG4])
  //pics are removed, there are no more pictures on  page
  await timelinePage.deletePhotosFromTimeline(4, true)

  await t.fixtureCtx.vr.takeScreenshotAndUpload(
    `${FEATURE_PREFIX}/${TEST_DELETE2}-1`
  )
  console.groupEnd()
})
