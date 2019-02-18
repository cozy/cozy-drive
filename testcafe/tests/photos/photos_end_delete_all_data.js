import { photosUser } from '../helpers/roles' //import roles for login
import { TESTCAFE_PHOTOS_URL } from '../helpers/utils'
import Page from '../pages/photos-model'

const page = new Page()

fixture`Delete all photos`.page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(async t => {
  await t.useRole(photosUser)
  await page.waitForLoading()
  await page.initPhotosCount()
})

test('Deleting 1st pic on Timeline : Open up a modal, and confirm', async () => {
  await page.selectPhotos(1)
  //pic is removed
  await page.deletePhotos(1)
})

test('Deleting the 1st 4 pics on Timeline : Open up a modal, and confirm', async () => {
  await page.selectPhotos(4)
  //pics are removed, there are no more pictures on  page
  await page.deletePhotos(4, true)
})
