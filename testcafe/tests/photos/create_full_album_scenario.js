import { photosUser } from '../helpers/roles'
import { TESTCAFE_PHOTOS_URL } from '../helpers/utils'
import { ALBUM_DATE_TIME } from '../helpers/data'
import PhotoPage from '../pages/photos-model'
import AlbumPage from '../pages/photos-album-model'

const photoPage = new PhotoPage()
const photoAlbumPage = new AlbumPage()

fixture`Create new album with photos`.page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(
  async t => {
    await t.useRole(photosUser)
    await photoPage.waitForLoading()
    await photoPage.initPhotosCount()
  }
)

test('Go into Album view, and check that there is no album', async () => {
  await photoPage.goToAlbums()
  await photoAlbumPage.checkEmptyAlbum()
})

test('Go into Album view, and create new album with 3 photos', async () => {
  await photoPage.goToAlbums()
  await photoAlbumPage.addNewAlbum(ALBUM_DATE_TIME, 3)
  await photoAlbumPage.checkAlbumPage(ALBUM_DATE_TIME, 3)
  //we need to check the album page, just after the redirection from album creation, hence this step being in this test
})

test('Go to ALBUM_DATE_TIME, and rename it (exit by pressing "enter")', async () => {
  await photoPage.goToAlbums()
  await photoAlbumPage.goToAlbum(ALBUM_DATE_TIME)
  await photoAlbumPage.checkAlbumPage(ALBUM_DATE_TIME, 3)
  await photoAlbumPage.renameAlbum(ALBUM_DATE_TIME, `New_${ALBUM_DATE_TIME}`, {
    exitWithEnter: true
  })
  await photoAlbumPage.checkAlbumPage(`New_${ALBUM_DATE_TIME}`, 3)
})

test('Go to New_ALBUM_DATE_TIME, and rename it (exit by clicking away)', async () => {
  await photoPage.goToAlbums()
  await photoAlbumPage.goToAlbum(`New_${ALBUM_DATE_TIME}`)
  await photoAlbumPage.checkAlbumPage(`New_${ALBUM_DATE_TIME}`, 3)
  await photoAlbumPage.renameAlbum(
    `New_${ALBUM_DATE_TIME}`,
    `New2_${ALBUM_DATE_TIME}`,
    { exitWithEnter: false }
  )
  await photoAlbumPage.checkAlbumPage(`New2_${ALBUM_DATE_TIME}`, 3)
})

test('Go to New2_ALBUM_DATE_TIME, and add 2 more photos', async () => {
  await photoPage.goToAlbums()
  await photoAlbumPage.goToAlbum(`New2_${ALBUM_DATE_TIME}`)
  await photoAlbumPage.addPhotosToAlbum(`New2_${ALBUM_DATE_TIME}`, 3, 2)
  await photoAlbumPage.backToAlbumsList()
  await photoAlbumPage.isAlbumExistsAndVisible(`New2_${ALBUM_DATE_TIME}`, 5)
})

test('Go to New2_ALBUM_DATE_TIME, and remove the 1st photos', async () => {
  await photoPage.goToAlbums()
  await photoAlbumPage.goToAlbum(`New2_${ALBUM_DATE_TIME}`)
  await photoAlbumPage.removePhoto(1)
})

test('Go to New2_ALBUM_DATE_TIME, and delete it', async () => {
  await photoPage.goToAlbums()
  await photoAlbumPage.goToAlbum(`New2_${ALBUM_DATE_TIME}`)
  await photoAlbumPage.deleteAlbum()
  await photoAlbumPage.waitForLoading()
  await photoAlbumPage.checkEmptyAlbum() //There is no more album
})
