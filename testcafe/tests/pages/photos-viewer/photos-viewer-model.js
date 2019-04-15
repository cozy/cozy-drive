import { t } from 'testcafe'
import { isExistingAndVisibile } from '../../helpers/utils'
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
