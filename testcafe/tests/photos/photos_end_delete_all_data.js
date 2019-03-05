import { photosUser } from '../helpers/roles' //import roles for login
import { TESTCAFE_PHOTOS_URL } from '../helpers/utils'
import Page from '../pages/photos-model'
import { IMG0, IMG1, IMG2, IMG3, IMG4 } from '../helpers/data'

const page = new Page()

fixture`Delete all photos`.page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(async t => {
  await t.useRole(photosUser)
  await page.waitForLoading()
  await page.initPhotosCount()
})

test('Deleting 1st pic on Timeline : Open up a modal, and confirm', async () => {
  await page.selectPhotosByName([`${IMG0}`])
  //pic is removed
  await page.deletePhotos(1)
})

test('Deleting 4 pics on Timeline : Open up a modal, and confirm', async () => {
  await page.selectPhotosByName([`${IMG1}`, `${IMG2}`, `${IMG3}`, `${IMG4}`])
  //pics are removed, there are no more pictures on  page
  await page.deletePhotos(4, true)
})
