import { t } from 'testcafe'
import { isExistingAndVisibile } from '../helpers/utils'
import PRECISION from '../helpers/visualreview-utils'
import PublicDriveVRPage from '../pages/drive-model-public'
import ViewerPage from '../pages/drive-viewer-model'

const publicDrivePage = new PublicDriveVRPage()

export default class PublicViewerPage extends ViewerPage {
  constructor() {
    super()
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {string} fileStartName : file to open to start the navigation testing
  //@param {number} numberOfNavigation : the number of file we want to go through during the test.
  async checkViewerNavigation_vr(
    screenshotPath,
    fileStartName,
    numberOfNavigation
  ) {
    const startIndex = await publicDrivePage.getElementIndex(fileStartName)
    console.log(`↳ 📁 ${fileStartName} with index : ${startIndex}`)
    await this.openViewerForFile(fileStartName)

    for (let i = startIndex; i < startIndex + numberOfNavigation; i++) {
      await this.navigateToNextFile(i)
      await t.fixtureCtx.vr.takeScreenshotAndUpload(
        `${screenshotPath}-${i}-next`
      )
    }

    for (let i = startIndex + numberOfNavigation; i > startIndex; i--) {
      await this.navigateToPrevFile(i)
      await t.fixtureCtx.vr.takeScreenshotAndUpload(
        `${screenshotPath}-${i}-prev`
      )
    }
    await this.closeViewer({
      exitWithEsc: false
    })
  }

  // perform checks commons to all viewer : navigation / toolbar download btn / closing viewer
  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {string} filename : file to check
  //@param {string} type : file type to check for Specific viewer
  async checkPublicViewer_vr(screenshotPath, fileName, type) {
    const index = await publicDrivePage.getElementIndex(fileName)
    console.log(`↳ 📁 ${fileName} with index : ${index}`)
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
    //avoid unwanted hover for screenshots
    await t.hover(this.viewerWrapper, {
      offsetX: 0,
      offsetY: 0
    })
    await t.fixtureCtx.vr.takeScreenshotAndUpload(screenshotPath)
    //precision back to default
    t.fixtureCtx.vr.options.compareSettings = {
      precision: PRECISION //precision goes from 0 to 255
    }
  }

  //
  //Specific check for audioViewer
  async checkAudioViewer() {
    await isExistingAndVisibile(this.audioViewer, 'Audio viewer')
    await isExistingAndVisibile(
      this.audioViewerControls,
      'Audio viewer controls'
    )
    //wait for file to load to get a good screenshots
    await t.wait(5000)
    //modify precision to avoid false positive due to loading state
    t.fixtureCtx.vr.options.compareSettings = {
      precision: 100 //precision goes from 0 to 255
    }
  }

  //Specific check for videoViewer
  async checkVideoViewer() {
    await isExistingAndVisibile(this.videoViewer, 'Video viewer')
    await isExistingAndVisibile(
      this.videoViewerControls,
      'Video viewer controls'
    )
    //wait for file to load to get a good screenshots
    await t.wait(5000)
    //modify precision to avoid false positive due to loading state
    t.fixtureCtx.vr.options.compareSettings = {
      precision: 100 //precision goes from 0 to 255
    }
  }

  //Specific check for textViewer
  async checkTextViewer() {
    await isExistingAndVisibile(this.txtViewer, 'text viewer')
    await isExistingAndVisibile(this.txtViewerContent, 'text viewer controls')
  }

  //Specific check for imageViewer
  async checkImageViewer() {
    await isExistingAndVisibile(this.imageViewer, 'image viewer')
    await isExistingAndVisibile(
      this.imageViewerContent,
      'image viewer controls'
    )
  }

  //Specific check for no-viewer
  async checkNoViewer() {
    await isExistingAndVisibile(this.noViewer, 'no-viewer Viewer')
  }

  //Specific check for no viewer : other download btn
  async checkNoViewerDownload(fileName) {
    await this.openViewerForFile(fileName)
    await isExistingAndVisibile(
      this.btnNoViewerDownload,
      'no Viewer Download butoon'
    )
    await t.setNativeDialogHandler(() => true).click(this.btnNoViewerDownload)

    await this.closeViewer({
      exitWithEsc: true
    })
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {string} filename : file to check
  async checkMobilePublicViewer_vr(screenshotsPath, fileName) {
    await t.resizeWindowToFitDevice('iPhone 6', {
      portraitOrientation: true
    })

    await this.openViewerForFile(fileName)

    await t.fixtureCtx.vr.takeScreenshotAndUpload(screenshotsPath)
    await t.maximizeWindow() //Back to desktop
  }
}
