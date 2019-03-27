import { photosUser } from '../helpers/roles'
import { TESTCAFE_PHOTOS_URL, SLUG } from '../helpers/utils'
import { DATA_PATH, IMG0, IMG1, IMG2, IMG3, IMG4 } from '../helpers/data'
import { initVR } from '../helpers/visualreview-utils'
import TimelinePage from '../pages/photos/photos-timeline-model'

const timelinePage = new TimelinePage()

fixture`Upload photos`.page`${TESTCAFE_PHOTOS_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, `fixture : upload photos`)
  })
  .beforeEach(async t => {
    await t.useRole(photosUser)
    await timelinePage.waitForLoading()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test('Uploading 1 pic from Photos view', async t => {
  await t.maximizeWindow() //Real fullscren for VR
  ///there is no photos on page
  await timelinePage.initPhotoCountZero()
  await timelinePage.uploadPhotos([`${DATA_PATH}/${IMG0}`])

  await t.fixtureCtx.vr.takeScreenshotAndUpload('UploadImage/Upload-1-pic.png')
})

test('Uploadingt 4 pics from Photos view', async t => {
  await timelinePage.initPhotosCount()
  await timelinePage.uploadPhotos([
    `${DATA_PATH}/${IMG1}`,
    `${DATA_PATH}/${IMG2}`,
    `${DATA_PATH}/${IMG3}`,
    `${DATA_PATH}/${IMG4}`
  ])

  await t.fixtureCtx.vr.takeScreenshotAndUpload('UploadImage/Upload-4-pic.png')
})
