import { photosUser } from '../helpers/roles' //import roles for login
import { TESTCAFE_PHOTOS_URL } from '../helpers/utils'
import random from 'lodash/random'
import Timeline from '../pages/photos/photos-timeline-model'
import Viewer from '../pages/photos-viewer/photos-viewer-model'

const timelinePage = new Timeline()
const photoViewer = new Viewer()

fixture`PHOTOS - CRUD`.page`${TESTCAFE_PHOTOS_URL}/`.beforeEach(async t => {
  await t.useRole(photosUser)
  await timelinePage.waitForLoading()
  await timelinePage.initPhotosCount()
})

test('Select 1 pic from Photos view', async () => {
  //Selection bar shows up. It includes AddtoAlbun, Download and Delete buttons
  await timelinePage.selectPhotos(1)
  await timelinePage.checkPhotobar()
})

test('Select 3 pic from Photos view', async () => {
  //Selection bar shows up. It includes AddtoAlbun, Download and Delete buttons
  await timelinePage.selectPhotos(3)
  await timelinePage.checkPhotobar()
})

test('Open 1st pic', async () => {
  //Right arrow shows up. Navigatio to other pics is OK, Closing pic (X or 'esc') is Ok
  await photoViewer.openPhotoFullscreen(0)
  await photoViewer.navigateToNextPhoto(0)
  await photoViewer.closeViewer({
    exitWithEsc: true
  })
  await photoViewer.openPhotoFullscreen(0)
  await photoViewer.navigateToPrevPhoto(0)
  await photoViewer.closeViewer({
    exitWithEsc: false
  })
})

test('Open Last pic', async t => {
  //Left arrow shows up. Navigatio to other pics is OK, Closing pic (X or 'esc') is Ok

  await photoViewer.openPhotoFullscreen(t.ctx.allPhotosStartCount - 1)
  await photoViewer.navigateToNextPhoto(t.ctx.allPhotosStartCount - 1)
  await photoViewer.closeViewer({
    exitWithEsc: true
  })
  await photoViewer.openPhotoFullscreen(t.ctx.allPhotosStartCount - 1)
  await photoViewer.navigateToPrevPhoto(t.ctx.allPhotosStartCount - 1)
  await photoViewer.closeViewer({
    exitWithEsc: false
  })
})

test('Open a random pic (not first nor last)', async t => {
  //Both arrows show up. Navigatio to other pics is OK, Closing pic (X or 'esc') is Ok
  // We need at least 3 pics in our cozy for this test to pass

  const photoIndex = random(1, t.ctx.allPhotosStartCount - 2)

  console.log('Open random pic  > photoIndex ' + photoIndex)
  await photoViewer.openPhotoFullscreen(photoIndex)
  await photoViewer.navigateToNextPhoto(photoIndex)
  await photoViewer.closeViewer({
    exitWithEsc: true
  })
  await photoViewer.openPhotoFullscreen(photoIndex)
  await photoViewer.navigateToPrevPhoto(photoIndex)
  await photoViewer.closeViewer({
    exitWithEsc: false
  })
})
