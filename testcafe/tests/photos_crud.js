import { Selector, Role } from 'testcafe' //import testcafe function
import { photosUser } from './helpers/roles' //import roles for login
import { getPageUrl, TESTCAFE_PHOTOS_URL } from './helpers/utils'
import random from 'lodash/random'

import Page from './pages/photos-model'

const page = new Page()

fixture`PHOTOS - CRUD`.page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(async t => {
  await t.useRole(photosUser)
  page.waitForLoading()
  t.ctx.allPhotosStartCount = await page.getPhotosCount('Before') //Pics count at test start
})

test('Uploading 1 pic from Photos view', async t => {
  await page.uploadPhotos(['../data/IMG0.jpg'])
})

test('Uploading 3 pcis from Photos view', async t => {
  await page.uploadPhotos([
    '../data/IMG-JPG.jpg',
    '../data/IMG-PNG.png',
    '../data/IMG-GIF.gif'
  ])
})

test('Select 1 pic from Photos view', async t => {
  //Selection bar shows up. It includes AddtoAlbun, Download and Delete buttons
  await page.selectPhotos(1)
  await page.checkPhotobar()
})

test('Select 3 pic from Photos view', async t => {
  //Selection bar shows up. It includes AddtoAlbun, Download and Delete buttons
  await page.selectPhotos(3)
  await page.checkPhotobar()
})

test('Open 1st pic', async t => {
  //Right arrow shows up. Navigatio to other pics is OK, Closing pic (X or 'esc') is Ok
  await page.openPhotoFullscreen(0)
  await page.navigateToNextPhoto(0)
  await page.closePhotoFullscreenX()

  await page.openPhotoFullscreen(0)
  await page.navigateToPrevPhoto(0)
  await page.closePhotoFullscreenEsc()
})

test('Open Last pic', async t => {
  //Left arrow shows up. Navigatio to other pics is OK, Closing pic (X or 'esc') is Ok

  await page.openPhotoFullscreen(t.ctx.allPhotosStartCount - 1)
  await page.navigateToNextPhoto(t.ctx.allPhotosStartCount - 1)
  await page.closePhotoFullscreenX()

  await page.openPhotoFullscreen(t.ctx.allPhotosStartCount - 1)
  await page.navigateToPrevPhoto(t.ctx.allPhotosStartCount - 1)
  await page.closePhotoFullscreenEsc()
})

test('Open a random pic (not first nor last)', async t => {
  //Both arrows show up. Navigatio to other pics is OK, Closing pic (X or 'esc') is Ok
  // We need at least 3 pics in our cozy for this test to pass

  const photoIndex = random(1, t.ctx.allPhotosStartCount - 2)

  console.log('Open random pic  > photoIndex ' + photoIndex)
  await page.openPhotoFullscreen(photoIndex)
  await page.navigateToNextPhoto(photoIndex)
  await page.closePhotoFullscreenX()

  await page.openPhotoFullscreen(photoIndex)
  await page.navigateToPrevPhoto(photoIndex)
})

test('Deleting 1st pic in Photo view : Open up a modal, and confirm', async t => {
  //pic is removed
  await page.deletePhotos(1)
})

test('Deleting the 1st 3 pics in Photo view : Open up a modal, and confirm', async t => {
  //pics are removed
  await page.deletePhotos(3)
})
