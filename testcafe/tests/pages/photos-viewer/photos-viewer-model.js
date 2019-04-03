import { Selector, t } from 'testcafe'
import { getPageUrl, isExistingAndVisibile } from '../../helpers/utils'
import Viewer from '../viewer/viewer-model'
import Photos from '../photos/photos-model'
import { THUMBNAIL_DELAY } from '../../helpers/data'

const photoPage = new Photos()

export default class PhotoViewer extends Viewer {
  constructor() {
    super()
    // Photo fullscreen
    this.photoFull = Selector('[class*="pho-viewer-imageviewer"]').find('img')
  }

  async openPhotoFullscreen(index) {
    await isExistingAndVisibile(
      photoPage.photoThumb(index),
      `${index}th Photo thumb`
    )

    await t.click(photoPage.photoThumb(index))
    await isExistingAndVisibile(this.photoFull, 'fullscreen photos')
  }

  //Used in Older test (without VisualReview)
  async navigateToNextPhoto(index) {
    if (index == t.ctx.allPhotosStartCount - 1) {
      //this is the last picture, so next button does not exist
      await t
        .expect(this.viewerNavNext.exists)
        .notOk('Next button on last picture')
    } else {
      const photo1src = await this.photoFull.getAttribute('src')
      const photo1url = await getPageUrl()
      await isExistingAndVisibile(this.viewerNavNext, 'Div photo Next')
      await t.hover(this.viewerNavNext) //not last photo, so next button should exists
      await isExistingAndVisibile(this.viewerNavNextBtn, 'Next arrow')
      await t.click(this.viewerNavNextBtn)

      const photo2src = await this.photoFull.getAttribute('src')
      const photo2url = await getPageUrl()
      //Photo has change, so src & url are different
      await isExistingAndVisibile(this.photoFull, '(next) fullscreen photos')
      await t.expect(photo1src).notEql(photo2src)
      await t.expect(photo1url).notEql(photo2url)
      //!FIXME add data-photo-id=xxx in photo and check url=#/photos/xxx
    }
  }
  //Used in Older test (without VisualReview)
  async navigateToPrevPhoto(index) {
    if (index == 0) {
      //this is the 1st picture, so previous button does not exist
      await t
        .expect(this.viewerNavPrevious.exists)
        .notOk('Previous button on first picture')
    } else {
      const photo1src = await this.photoFull.getAttribute('src')
      const photo1url = await getPageUrl()
      await isExistingAndVisibile(this.viewerNavPrevious, 'Div photo prev')

      await t.hover(this.viewerNavPrevious) //not 1st photo, so previous button should exists
      await isExistingAndVisibile(this.viewerNavPreviousBtn, 'prev arrow')
      await t.click(this.viewerNavPreviousBtn)

      const photo2src = await this.photoFull.getAttribute('src')
      const photo2url = await getPageUrl()
      //Photo has change, so src & url are different
      await isExistingAndVisibile(this.photoFull, '(prev) fullscreen photos')
      await t.expect(photo1src).notEql(photo2src)
      await t.expect(photo1url).notEql(photo2url)
      //!FIXME add data-photo-id=xxx in photo and check url=#/photos/xxx
    }
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {number} startIndex : index of the 1st photos to open
  //@param {number} numberOfNavigation : the number of file we want to go through during the test.
  async openPhotoAndCheckViewerNavigation(
    startIndex,
    numberOfNavigation,
    screenshotPath
  ) {
    console.log(`↳ 📁 photo with index : ${startIndex}`)
    await this.openPhotoFullscreen(startIndex)
    await this.navigateInViewer(screenshotPath, startIndex, numberOfNavigation)
    await this.closeViewer({
      exitWithEsc: false
    })
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {string} index : file to check
  async openPhotoAndCheckViewer(index, screenshotPath, hasMask = false) {
    console.log(`↳ 📁 photo with index : ${index}`)
    await this.openPhotoFullscreen(index)
    await this.checkImageViewer()

    await t.wait(THUMBNAIL_DELAY)
    //avoid unwanted hover for screenshots
    await t.hover(this.viewerControls, {
      offsetX: 0,
      offsetY: 0
    })
    await t.fixtureCtx.vr.takeScreenshotAndUpload(screenshotPath, hasMask)
    await this.closeViewer({
      exitWithEsc: true
    })
  }
}
