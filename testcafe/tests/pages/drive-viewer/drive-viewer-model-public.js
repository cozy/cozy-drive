import logger from '../../helpers/logger'
import { t } from 'testcafe'
import { PRECISION } from '../../helpers/visualreview-utils'
import PublicDriveVRPage from '../drive/drive-model-public'
import ViewerPage from './drive-viewer-model'
import { THUMBNAIL_DELAY } from '../../helpers/data'
import * as selectors from '../selectors'

const publicDrivePage = new PublicDriveVRPage()

export default class PublicViewerPage extends ViewerPage {
  // perform checks commons to all viewer : navigation / toolbar download btn / closing viewer
  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {string} filename : file to check
  //@param {string} type : file type to check for Specific viewer
  async openFileAndCheckPublicViewer({
    screenshotPath: screenshotPath,
    fileName: fileName,
    type: type,
    withMask = false
  }) {
    const index = await publicDrivePage.getElementIndex(fileName)
    logger.info(`↳ 📁 ${fileName} with index : ${index}`)
    await this.openViewerForFile(fileName)

    switch (type) {
      case 'img':
        await this.checkImageViewer()
        break
      case 'txt':
        await this.checkTextViewer()
        break
      case 'audio':
        await this.checkAudioViewer()
        break
      case 'video':
        await this.checkVideoViewer()
        break
      default:
        await this.checkNoViewer()
        break
    }
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
    //precision back to default
    t.fixtureCtx.vr.options.compareSettings = {
      precision: PRECISION //precision goes from 0 to 255
    }
    await this.closeViewer({
      exitWithEsc: true
    })
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {string} filename : file to check
  async openFileAndCheckMobilePublicViewer({
    screenshotPath: screenshotPath,
    fileName: fileName,
    withMask = false
  }) {
    await t.resizeWindowToFitDevice('iPhone 6', {
      portraitOrientation: true
    })
    await this.openViewerForFile(fileName)
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
    await t.maximizeWindow() //Back to desktop
  }

  //Temp method to avoid problem with chrome 73
  //https://trello.com/c/fAu0VmuW/1827-probl%C3%A8me-daffichage-viewer-texte-lors-du-redimensionnement-%C3%A0-la-vol%C3%A9e-chrome-73
  async openFileAndCheckMobilePublicViewerBiggerResolution({
    screenshotPath: screenshotPath,
    fileName: fileName,
    withMask = false
  }) {
    await t.resizeWindowToFitDevice('iPad', {
      portraitOrientation: true
    })
    await t.eval(() => location.reload(true))
    await this.openViewerForFile(fileName)

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
    await t.maximizeWindow() //Back to desktop
  }
}
