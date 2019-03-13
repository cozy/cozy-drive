import { photosUser } from '../helpers/roles'
import { TESTCAFE_PHOTOS_URL } from '../helpers/utils'
import Page from '../pages/photos-model'
import { IMG0, IMG1, IMG2, IMG3, IMG4 } from '../helpers/data'
import { VisualReviewTestcafe } from '../helpers/visualreview-utils'

const page = new Page()

fixture`Delete all photos`.page`${TESTCAFE_PHOTOS_URL}/`
  .before(async ctx => {
    ctx.vr = new VisualReviewTestcafe({
      projectName: 'PHOTOS',
      suiteName: `fixture : delete photos`
    })
    await ctx.vr.start()
  })
  .beforeEach(async t => {
    await t.useRole(photosUser)
    await page.waitForLoading()
    await page.initPhotosCount()
  })
  .after(async ctx => {
    await ctx.vr.checkVr()
  })

test('Deleting 1st pic on Timeline : Open up a modal, and confirm', async t => {
  await page.selectPhotosByName([IMG0])
  //pic is removed
  await page.deletePhotos(1)

  await t.fixtureCtx.vr.takeScreenshotAndReview('delete-1-pic.png')
})

test('Deleting 4 pics on Timeline : Open up a modal, and confirm', async t => {
  await page.selectPhotosByName([IMG1, IMG2, IMG3, IMG4])
  //pics are removed, there are no more pictures on  page
  await page.deletePhotos(4, true)

  await t.fixtureCtx.vr.takeScreenshotAndReview('delete-4-pics.png')
})
