import { photosUser } from '../helpers/roles'
import { TESTCAFE_PHOTOS_URL } from '../helpers/utils'
import { ALBUM_DATE_TIME } from '../helpers/data'
import Timeline from '../pages/photos/photos-timeline-model'
import AlbumPage from '../pages/photos-album/album-model.js'
import AlbumsPage from '../pages/photos-albums/albums-model'

const timelinePage = new Timeline()
const photoAlbumPage = new AlbumPage()
const photoAlbumsPage = new AlbumsPage()

fixture`Create new empty album and add photos`
  .page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(async t => {
  console.group(`\n↳ ℹ️  Login & Initialization`)
  await t.maximizeWindow()

  await t.useRole(photosUser)
  await timelinePage.waitForLoading()
  await timelinePage.initPhotosCount()
  console.groupEnd()
})

test('Go into Album view, and check that there is no album', async () => {
  console.group('↳ ℹ️  Go into Album view, and check that there is no album')
  await timelinePage.goToAlbums()
  await photoAlbumsPage.checkEmptyAlbum()
  console.groupEnd()
})

test('Go into Album view, and create new empty album', async () => {
  console.group('↳ ℹ️  Go into Album view, and create new empty album')
  await timelinePage.goToAlbums()
  await photoAlbumsPage.addNewAlbum({
    albumName: ALBUM_DATE_TIME,
    photoNumber: 0
  })
  await photoAlbumPage.checkAlbumPage(ALBUM_DATE_TIME, 0)
  //we need to check the album page, just after the redirection from album creation, hence this step being in this test
  console.groupEnd()
})

test('Go to ALBUM_DATE_TIME, and rename it (exit by pressing "enter")', async () => {
  console.group(
    `↳ ℹ️  Go to ${ALBUM_DATE_TIME}, and rename it (exit by pressing "enter")`
  )
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(ALBUM_DATE_TIME)
  await photoAlbumPage.checkAlbumPage(ALBUM_DATE_TIME, 0)
  await photoAlbumPage.renameAlbum(ALBUM_DATE_TIME, `New_${ALBUM_DATE_TIME}`, {
    exitWithEnter: true
  })
  await photoAlbumPage.checkAlbumPage(`New_${ALBUM_DATE_TIME}`, 0)
  console.groupEnd()
})

test('Go to New_ALBUM_DATE_TIME, and rename it (exit by clicking away)', async () => {
  console.group(
    `↳ ℹ️  Go to New_${ALBUM_DATE_TIME}, and rename it (exit by clicking away)`
  )
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(`New_${ALBUM_DATE_TIME}`)
  await photoAlbumPage.checkAlbumPage(`New_${ALBUM_DATE_TIME}`, 0)
  await photoAlbumPage.renameAlbum(
    `New_${ALBUM_DATE_TIME}`,
    `New2_${ALBUM_DATE_TIME}`,
    { exitWithEnter: false }
  )
  await photoAlbumPage.checkAlbumPage(`New2_${ALBUM_DATE_TIME}`, 0)
  console.groupEnd()
})

test('Go to New2_ALBUM_DATE_TIME, and add 2 more photos', async () => {
  console.group(`↳ ℹ️  Go to New2_${ALBUM_DATE_TIME}, and add 2 more photos`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(`New2_${ALBUM_DATE_TIME}`)
  await photoAlbumPage.addPhotosToAlbum(`New2_${ALBUM_DATE_TIME}`, 0, 2)
  await photoAlbumPage.backToAlbumsList()
  await photoAlbumsPage.isAlbumExistsAndVisible(`New2_${ALBUM_DATE_TIME}`, 2)
  console.groupEnd()
})

test('Go to New2_ALBUM_DATE_TIME, and remove the 1st photos', async () => {
  console.group(
    `↳ ℹ️  Go to New2_${ALBUM_DATE_TIME}, and remove the 1st photos`
  )
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(`New2_${ALBUM_DATE_TIME}`)
  await photoAlbumPage.removePhotoFromAlbum(1)
  console.groupEnd()
})

test('Go to New2_ALBUM_DATE_TIME, and delete it', async () => {
  console.group(`↳ ℹ️  Go to New2_${ALBUM_DATE_TIME}, and delete it`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(`New2_${ALBUM_DATE_TIME}`)
  await photoAlbumPage.deleteAlbum()
  await photoAlbumPage.waitForLoading()
  await photoAlbumsPage.checkEmptyAlbum() //There is no more album
  console.groupEnd()
})
