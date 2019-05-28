//import { Role } from 'testcafe'
import logger from '../helpers/logger'
import { photosUser } from '../helpers/roles'
import {
  TESTCAFE_PHOTOS_URL,
  SLUG,
  deleteLocalFile,
  checkLocalFile,
  setDownloadPath
} from '../helpers/utils'
import { initVR } from '../helpers/visualreview-utils'
import * as selectors from '../pages/selectors'

import TimelinePage from '../pages/photos/photos-timeline-model'
import AlbumPage from '../pages/photos-album/album-model'
import AlbumsPage from '../pages/photos-albums/albums-model'
import PublicPhotos from '../pages/photos/photos-model-public'
import PhotoViewer from '../pages/photos-viewer/photos-viewer-model'

const timelinePage = new TimelinePage()
const photoAlbumPage = new AlbumPage()
const photoAlbumsPage = new AlbumsPage()
const publicPhotoPage = new PublicPhotos()
const photosViewer = new PhotoViewer()

let data = require('../helpers/data')

//Scenario const
const FEATURE_PREFIX = 'AlbumSharingScenario'

const FIXTURE_INIT = `${FEATURE_PREFIX} 1- Create and Share Album`
const TEST_CREATE_ALBUM = `1-1 Create Album`
const TEST_SHARE_ALBUM = `1-2 Share Album`

const FIXTURE_PUBLIC_WITH_DL = `${FEATURE_PREFIX} 2- Go to public link and download files`
const TEST_PUBLIC_ALBUM_DESKTOP = `2-1 Check public album on desktop`
const TEST_PUBLIC_ALBUM_MOBILE = `2-1 Check public album on mobile`

const FIXTURE_UNSHARE = `${FEATURE_PREFIX} 3- Unshare Album`
const TEST_UNSHARE_ALBUM = `${FEATURE_PREFIX} 3-1 Unshare Album`

const FIXTURE_PUBLIC_NO_ACCESS = `${FEATURE_PREFIX} 4- Go to public link without access`
const TEST_PUBLIC_NO_ACCESS = `4-1 Check no access to old share`

const FIXTURE_CLEANUP = `${FEATURE_PREFIX} 5- Cleanup Data (Remove album)`
const TEST_DELETE_ALBUM = `5-1 Delete Album`

//************************
//Tests when authentified
//************************
fixture`${FIXTURE_INIT}`.page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(async t => {
  console.group(`\n↳ ℹ️  Login & Initialization`)
  await t.maximizeWindow()

  await t.useRole(photosUser)
  await timelinePage.waitForLoading()
  await timelinePage.initPhotosCount()
  console.groupEnd()
})

test(TEST_CREATE_ALBUM, async () => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_CREATE_ALBUM}`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.addNewAlbum({
    albumName: FEATURE_PREFIX,
    photoNumber: 3
  })
  //we need to check the album page, just after the redirection from album creation, hence this step being in this test
  await photoAlbumPage.checkAlbumPage(FEATURE_PREFIX, 3)
  console.groupEnd()
})

test(TEST_SHARE_ALBUM, async () => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_SHARE_ALBUM}`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(FEATURE_PREFIX)
  await photoAlbumPage.shareAlbumPublicLink()

  const link = await selectors.btnCopyShareByLink.getAttribute('data-test-url')
  if (link) {
    data.sharingLink = link
    logger.debug(`data.sharingLink : ` + data.sharingLink)
  }
  console.groupEnd()
})

//************************
// Public (no authentification)
//************************
fixture`${FIXTURE_PUBLIC_WITH_DL}`.page`${TESTCAFE_PHOTOS_URL}/`
  .before(async ctx => {
    await initVR(ctx, SLUG, FIXTURE_PUBLIC_WITH_DL)
  })
  .beforeEach(async t => {
    console.group(
      `\n↳ ℹ️  no Loggin (anonymous) & DOWNLOAD_PATH initialization`
    )
    await t.maximizeWindow()

    //await t.useRole(Role.anonymous())
    await setDownloadPath(data.DOWNLOAD_PATH)
    await t.navigateTo(data.sharingLink)
    //Init count for navigation
    t.ctx.totalFilesCount = await publicPhotoPage.getPhotosCount('Before')
    console.groupEnd()
  })
  .afterEach(async t => {
    logger.info(
      `↳ ℹ️  ${FEATURE_PREFIX} - Checking downloaded file for ${FEATURE_PREFIX.toLowerCase()}.zip`
    )
    await checkLocalFile(
      t,
      `${data.DOWNLOAD_PATH}/${FEATURE_PREFIX.toLowerCase()}.zip`
    )
    await deleteLocalFile(
      `${data.DOWNLOAD_PATH}/${FEATURE_PREFIX.toLowerCase()}.zip`
    )
  })
  .after(async ctx => {
    await ctx.vr.checkRunStatus()
  })

test(TEST_PUBLIC_ALBUM_DESKTOP, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_ALBUM_DESKTOP} > Access an album public link, check the viewer, download the file(s), and check the 'create Cozy' link`
  )
  await publicPhotoPage.waitForLoading()
  await publicPhotoPage.checkActionMenuAlbumPublicDesktop()

  //Viewer
  await photosViewer.openPhotoAndCheckViewer({
    index: 0,
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_ALBUM_DESKTOP}-1`
  })
  await photosViewer.openPhotoAndCheckViewerNavigation({
    startIndex: 0,
    numberOfNavigation: 3,
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_ALBUM_DESKTOP}-2`
  })

  await t
    .wait(3000) //!FIXME to remove after https://trello.com/c/IZfev6F1/1658-drive-public-share-impossible-de-t%C3%A9l%C3%A9charger-le-fichier is fixed
    .setNativeDialogHandler(() => true)
    .click(selectors.btnPublicDownloadPhotosDesktop)
    .click(selectors.btnAlbumPublicCreateCozyMobileDesktop)
  await publicPhotoPage.checkCreateCozy()
  console.groupEnd()
})

test(TEST_PUBLIC_ALBUM_MOBILE, async t => {
  console.group(
    `↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_ALBUM_MOBILE} > Access an album public link, check the viewer, download the file(s), and check the 'create Cozy' link`
  )
  await t.resizeWindowToFitDevice('iPhone 6', {
    portraitOrientation: true
  })
  await publicPhotoPage.waitForLoading()
  //Viewer
  await photosViewer.openPhotoAndCheckViewer({
    index: 0,
    screenshotPath: `${FEATURE_PREFIX}/${TEST_PUBLIC_ALBUM_MOBILE}-1`
  })

  //Download
  await publicPhotoPage.checkPhotosDownloadButtonOnMobile()
  await t
    .wait(3000) //!FIXME to remove after https://trello.com/c/IZfev6F1/1658-drive-public-share-impossible-de-t%C3%A9l%C3%A9charger-le-fichier is fixed
    .setNativeDialogHandler(() => true)
    .click(selectors.btnPublicDownloadPhotosMobile)

  //create my cozy
  await publicPhotoPage.checkPhotosCozyCreationButtonOnMobile()
  await t.click(selectors.btnAlbumPublicCreateCozyMobile)
  await publicPhotoPage.checkCreateCozy()
  console.groupEnd()
})

//************************
//Tests when authentified
//************************
fixture`${FIXTURE_UNSHARE}`.page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(
  async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.maximizeWindow() //Back to desktop

    await t.useRole(photosUser)
    await timelinePage.waitForLoading()
    await timelinePage.initPhotosCount()
    console.groupEnd()
  }
)

test(TEST_UNSHARE_ALBUM, async () => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_UNSHARE_ALBUM}`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(FEATURE_PREFIX)
  await photoAlbumPage.unshareAlbumPublicLink()
  console.groupEnd()
})

//************************
// Public (no authentification)
//************************
fixture`${FIXTURE_PUBLIC_NO_ACCESS}`.page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(
  async t => {
    console.group(`\n↳ ℹ️  no Loggin (anonymous)`)
    await t.maximizeWindow()

    //await t.useRole(Role.anonymous())
    console.groupEnd()
  }
)

test(TEST_PUBLIC_NO_ACCESS, async t => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_PUBLIC_NO_ACCESS}`)
  await t.navigateTo(data.sharingLink)
  await publicPhotoPage.waitForLoading()
  await publicPhotoPage.checkNotAvailable()
  console.groupEnd()
})

//************************
//Tests when authentified
//************************
fixture`${FIXTURE_CLEANUP}`.page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(
  async t => {
    console.group(`\n↳ ℹ️  Login & Initialization`)
    await t.maximizeWindow()

    await t.useRole(photosUser)
    await timelinePage.waitForLoading()
    await timelinePage.initPhotosCount()
    console.groupEnd()
  }
)

test(TEST_DELETE_ALBUM, async () => {
  console.group(`↳ ℹ️  ${FEATURE_PREFIX} : ${TEST_DELETE_ALBUM}`)
  await timelinePage.goToAlbums()
  await photoAlbumsPage.goToAlbum(`${FEATURE_PREFIX}`)
  await photoAlbumPage.deleteAlbum()
  await photoAlbumPage.waitForLoading()
  await photoAlbumsPage.checkEmptyAlbum() //There is no more album
  console.groupEnd()
})
