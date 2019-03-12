import { photosUser } from '../helpers/roles' 
import { TESTCAFE_PHOTOS_URL } from '../helpers/utils'
import Page from '../pages/photos-model'
import { DATA_PATH, IMG0, IMG1, IMG2, IMG3, IMG4 } from '../helpers/data'
import { VisualReviewTestcafe } from '../helpers/visualreview-utils'

const page = new Page()

fixture`Upload photos`.page`${TESTCAFE_PHOTOS_URL}/`
  .before(async ctx => {
    ctx.vr = new VisualReviewTestcafe({
      projectName: 'PHOTOS',
      suiteName: `fixture : upload photos`
    })
    await ctx.vr.start()
  })
  .beforeEach(async t => {
    await t.useRole(photosUser)
    await page.waitForLoading()
  })
  .after(async ctx => {
    await ctx.vr.checkVr()
  })

test('Uploading 1 pic from Photos view', async t => {
  ///there is no photos on page
  await page.initPhotoCountZero()
  await page.uploadPhotos([`${DATA_PATH}/${IMG0}`])

  await t.fixtureCtx.vr.takeScreenshotAndReview('Upload-1-pic.png')
})

test('Uploadingt 4 pics from Photos view', async t => {
  await page.initPhotosCount()
  await page.uploadPhotos([
    `${DATA_PATH}/${IMG1}`,
    `${DATA_PATH}/${IMG2}`,
    `${DATA_PATH}/${IMG3}`,
    `${DATA_PATH}/${IMG4}`
  ])

  await t.fixtureCtx.vr.takeScreenshotAndReview('Upload-4-pic.png')
})
