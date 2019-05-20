import { photosUser } from '../helpers/roles'
import {
  TESTCAFE_PHOTOS_URL,
  SLUG,
  checkAllImagesExists
} from '../helpers/utils'
import Timeline from '../pages/photos/photos-timeline-model'
import AlbumPage from '../pages/photos-album/album-model.js'
import AlbumsPage from '../pages/photos-albums/albums-model'
import { initVR } from '../helpers/visualreview-utils'
import * as selectors from '../pages/selectors'
import { checkToastAppearsAndDisappears } from '../pages/commons'
import {
  IMG0,
  DATA_PATH,
  THUMBNAIL_DELAY,
  maskPhotosCluster,
  maskPhotosAddToAlbum
} from '../helpers/data'

const timelinePage = new Timeline()
const photoAlbumPage = new AlbumPage()
const photoAlbumsPage = new AlbumsPage()

//Scenario const
const FEATURE_PREFIX = 'CreateFullAlbumScenario'

const FIXTURE_INIT = `${FEATURE_PREFIX} 1- Create Full Album`
const TEST_CHECK_NO_ALBUM = `1-1 Check there is no album`
const TEST_CREATE_ALBUM = `1-2 Create Album with 3 photos`
const TEST_RENAME_ALBUM1 = `1-3 Rename Album (exitWithEnter)`
const TEST_RENAME_ALBUM2 = `1-4 Rename Album (exitWithClick)`
const TEST_ADD_MORE_PHOTOS = `1-5 Add 2 more photos`
const TEST_ADD_EXISTING_PHOTOS = `1-6 Add photos already in Album`

const TEST_REMOVE_PHOTO = `1-7 Remove 1 photo (from album)`
const TEST_DELETE_PHOTO_FROM_TIMELINE = `1-8 Delete 1 photo in album (from timeline)`
const TEST_DELETE_ALBUM = `1-9 Delete Album`
const TEST_CLEAN_UP = `1-10 Clean up - reupload deleted photo`

fixture`${FIXTURE_INIT}`.page`${TESTCAFE_PHOTOS_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_INIT)
  })
  .beforeEach(async t => {
    console.group(`\n↳ ℹ️  Loggin & Initialization`)
    await t.maximizeWindow()

    await t.useRole(photosUser)
    await timelinePage.waitForLoading()
    await timelinePage.initPhotosCount()
    console.groupEnd()
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_CHECK_NO_ALBUM, async () => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_CHECK_NO_ALBUM}`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.checkEmptyAlbum()
  console.groupEnd()
})

test(TEST_CREATE_ALBUM, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_CREATE_ALBUM}`)
  await timelinePage.goToAlbums()
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_ALBUM}-1`
  })
  await photoAlbumsPage.addNewAlbum({
    albumName: FEATURE_PREFIX,
    photoNumber: 3,
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_ALBUM}-2`,
    withMask: maskPhotosAddToAlbum
  })
  //we need to check the album page, just after the redirection from album creation, hence this step being in this test
  await photoAlbumPage.checkAlbumPage(FEATURE_PREFIX, 3)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_ALBUM}-3`
  })
  await photoAlbumPage.backToAlbumsList()
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CREATE_ALBUM}-4`
  })
  console.groupEnd()
})

test(TEST_RENAME_ALBUM1, async () => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_RENAME_ALBUM1}`)

  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(FEATURE_PREFIX)
  await photoAlbumPage.checkAlbumPage(FEATURE_PREFIX, 3)
  await photoAlbumPage.renameAlbum(FEATURE_PREFIX, `New_${FEATURE_PREFIX}`, {
    exitWithEnter: true
  })
  await photoAlbumPage.checkAlbumPage(`New_${FEATURE_PREFIX}`, 3)
  console.groupEnd()
})

test(TEST_RENAME_ALBUM2, async () => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_RENAME_ALBUM2}`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(`New_${FEATURE_PREFIX}`)
  await photoAlbumPage.checkAlbumPage(`New_${FEATURE_PREFIX}`, 3)
  await photoAlbumPage.renameAlbum(
    `New_${FEATURE_PREFIX}`,
    `New2_${FEATURE_PREFIX}`,
    { exitWithEnter: false }
  )
  await photoAlbumPage.checkAlbumPage(`New2_${FEATURE_PREFIX}`, 3)
  console.groupEnd()
})

test(TEST_ADD_MORE_PHOTOS, async () => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_ADD_MORE_PHOTOS}`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(`New2_${FEATURE_PREFIX}`)
  await photoAlbumPage.addPhotosToAlbum(`New2_${FEATURE_PREFIX}`, 3, 2)
  await photoAlbumPage.backToAlbumsList()
  await photoAlbumsPage.isAlbumExistsAndVisible(`New2_${FEATURE_PREFIX}`, 5)
  console.groupEnd()
})

test(TEST_ADD_EXISTING_PHOTOS, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_ADD_EXISTING_PHOTOS}`)
  await timelinePage.selectPhotos(1)
  await timelinePage.checkCozyBarOnTimeline()
  await t.click(selectors.btnAddToAlbumCozySelectionBar)

  await t.expect(selectors.spinner.exists).notOk('Spinner still spinning')
  await checkAllImagesExists()

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_ADD_EXISTING_PHOTOS}-1`,
    withMask: maskPhotosCluster
  })
  await t.click(selectors.album(`New2_${FEATURE_PREFIX}`))

  //Wait for toast alert to disapear before taking screenshot
  await checkToastAppearsAndDisappears(
    'This album already contains this photo.'
  )
  //go to album to get the screenshot
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(`New2_${FEATURE_PREFIX}`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_ADD_EXISTING_PHOTOS}-2`,
    delay: THUMBNAIL_DELAY,
    pageToWait: photoAlbumPage
  })
  console.groupEnd()
})

test(TEST_DELETE_PHOTO_FROM_TIMELINE, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_DELETE_PHOTO_FROM_TIMELINE}`)
  await timelinePage.selectPhotosByName([IMG0])
  await timelinePage.deletePhotosFromTimeline({
    numOfFiles: 1,
    screenshotPath: `${FEATURE_PREFIX}/${TEST_DELETE_PHOTO_FROM_TIMELINE}-1`,
    withMask: maskPhotosCluster
  })
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_DELETE_PHOTO_FROM_TIMELINE}-2`,
    delay: THUMBNAIL_DELAY,
    pageToWait: timelinePage,
    withMask: maskPhotosCluster
  })
  console.groupEnd()
})

test(TEST_REMOVE_PHOTO, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_REMOVE_PHOTO}`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(`New2_${FEATURE_PREFIX}`)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_REMOVE_PHOTO}-1`,
    delay: THUMBNAIL_DELAY,
    pageToWait: photoAlbumPage
  })
  await photoAlbumPage.removePhotoFromAlbum(1)
  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_REMOVE_PHOTO}-2`,
    delay: THUMBNAIL_DELAY,
    pageToWait: photoAlbumPage
  })
  console.groupEnd()
})

test(TEST_DELETE_ALBUM, async () => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_DELETE_ALBUM}`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(`New2_${FEATURE_PREFIX}`)
  await photoAlbumPage.deleteAlbum()
  await photoAlbumPage.waitForLoading()
  await photoAlbumsPage.checkEmptyAlbum() //There is no more album
  console.groupEnd()
})

test(TEST_CLEAN_UP, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_CLEAN_UP}`)
  await timelinePage.initPhotosCount()
  await timelinePage.uploadPhotos([`${DATA_PATH}/${IMG0}`])

  await t.fixtureCtx.vr.takeScreenshotAndUpload({
    screenshotPath: `${FEATURE_PREFIX}/${TEST_CLEAN_UP}-1`,
    delay: THUMBNAIL_DELAY,
    pageToWait: timelinePage,
    withMask: maskPhotosCluster
  })
  console.groupEnd()
})
