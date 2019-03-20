import { photosUser } from '../helpers/roles'
import { TESTCAFE_PHOTOS_URL, SLUG } from '../helpers/utils'
import Page from '../pages/photos-model'
import { IMG0, IMG1, IMG2, IMG3, IMG4 } from '../helpers/data'
import { initVR } from '../helpers/visualreview-utils'

const page = new Page()

fixture`Delete all photos`.page`${TESTCAFE_PHOTOS_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, `fixture : delete photos`)
  })
  .beforeEach(async t => {
    await t.useRole(photosUser)
    await page.waitForLoading()
    await page.initPhotosCount()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test('Deleting 1st pic on Timeline : Open up a modal, and confirm', async t => {
  await page.selectPhotosByName([IMG0])
  //pic is removed
  await page.deletePhotos(1)

  await t.fixtureCtx.vr.takeScreenshotAndUpload('DeleteImage/delete-1-pic.png')
})

test('Deleting 4 pics on Timeline : Open up a modal, and confirm', async t => {
  await page.selectPhotosByName([IMG1, IMG2, IMG3, IMG4])
  //pics are removed, there are no more pictures on  page
  await page.deletePhotos(4, true)

  await t.fixtureCtx.vr.takeScreenshotAndUpload('DeleteImage/delete-4-pics.png')
})
