import { t } from 'testcafe'
import logger from '../../helpers/logger'
import { isExistingAndVisibile } from '../../helpers/utils'
import Viewer from '../viewer/viewer-model'
import { THUMBNAIL_DELAY } from '../../helpers/data'
import * as selectors from '../selectors'

export default class PhotoViewer extends Viewer {
  async openPhotoFullscreen(index) {
    await isExistingAndVisibile(
      selectors.photoThumb(index),
      `selectors.photoThumb(${index})`
    )
    await t.click(selectors.photoThumb(index))
    await isExistingAndVisibile(selectors.photoFull, 'selectors.photoFull')
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {number} startIndex : index of the 1st photos to open
  //@param {number} numberOfNavigation : the number of file we want to go through during the test.
  async openPhotoAndCheckViewerNavigation({
    screenshotPath: screenshotPath,
    startIndex: startIndex,
    numberOfNavigation: numberOfNavigation
  }) {
    await this.openPhotoFullscreen(startIndex)
    await this.navigateInViewer({
      screenshotPath: screenshotPath,
      startIndex: startIndex,
      numberOfNavigation: numberOfNavigation
    })
    await this.closeViewer({
      exitWithEsc: false
    })
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {string} index : file to check
  async openPhotoAndCheckViewer({
    index: index,
    screenshotPath: screenshotPath,
    withMask = false
  }) {
    logger.info(`↳ 📁 Check Viewer for photo with index : ${index}`)
    await this.openPhotoFullscreen(index)
    await this.checkImageViewer()

    await t.wait(THUMBNAIL_DELAY)
    //avoid unwanted hover for screenshots
    await t.hover(selectors.viewerControls, {
      offsetX: 0,
      offsetY: 0
    })
    await t.fixtureCtx.vr.takeScreenshotAndUpload({
      screenshotPath: screenshotPath,
      withMask: withMask
    })
    await this.closeViewer({
      exitWithEsc: true
    })
  }
}
