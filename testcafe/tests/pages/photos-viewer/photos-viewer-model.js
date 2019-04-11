import { t } from 'testcafe'
import { getPageUrl, isExistingAndVisibile } from '../../helpers/utils'
import Viewer from '../viewer/viewer-model'
import { THUMBNAIL_DELAY } from '../../helpers/data'
import * as selectors from '../selectors'

export default class PhotoViewer extends Viewer {
  async openPhotoFullscreen(index) {
    await isExistingAndVisibile(
      selectors.photoThumb(index),
      `${index}th Photo thumb`
    )

    await t.click(selectors.photoThumb(index))
    await isExistingAndVisibile(selectors.photoFull, 'fullscreen photos')
  }

  //Used in Older test (without VisualReview)
  async navigateToNextPhoto(index) {
    if (index == t.ctx.allPhotosStartCount - 1) {
      //this is the last picture, so next button does not exist
      await t
        .expect(selectors.viewerNavNext.exists)
        .notOk('Next button on last picture')
    } else {
      const photo1src = await selectors.photoFull.getAttribute('src')
      const photo1url = await getPageUrl()
      await isExistingAndVisibile(selectors.viewerNavNext, 'Div photo Next')
      await t.hover(selectors.viewerNavNext) //not last photo, so next button should exists
      await isExistingAndVisibile(selectors.btnViewerNavNext, 'Next arrow')
      await t.click(selectors.btnViewerNavNext)

      const photo2src = await selectors.photoFull.getAttribute('src')
      const photo2url = await getPageUrl()
      //Photo has change, so src & url are different
      await isExistingAndVisibile(
        selectors.photoFull,
        '(next) fullscreen photos'
      )
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
        .expect(selectors.viewerNavPrevious.exists)
        .notOk('Previous button on first picture')
    } else {
      const photo1src = await selectors.photoFull.getAttribute('src')
      const photo1url = await getPageUrl()
      await isExistingAndVisibile(selectors.viewerNavPrevious, 'Div photo prev')

      await t.hover(selectors.viewerNavPrevious) //not 1st photo, so previous button should exists
      await isExistingAndVisibile(selectors.btnViewerNavPrevious, 'prev arrow')
      await t.click(selectors.btnViewerNavPrevious)

      const photo2src = await selectors.photoFull.getAttribute('src')
      const photo2url = await getPageUrl()
      //Photo has change, so src & url are different
      await isExistingAndVisibile(
        selectors.photoFull,
        '(prev) fullscreen photos'
      )
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
    await t.hover(selectors.viewerControls, {
      offsetX: 0,
      offsetY: 0
    })
    await t.fixtureCtx.vr.takeScreenshotAndUpload(screenshotPath, hasMask)
    await this.closeViewer({
      exitWithEsc: true
    })
  }
}
