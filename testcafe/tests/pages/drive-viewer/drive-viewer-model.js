import { t } from 'testcafe'
import {
  getElementWithTestId,
  isExistingAndVisibile
} from '../../helpers/utils'
import DrivePage from '../drive/drive-model'
import Viewer from '../viewer/viewer-model'

const drivePage = new DrivePage()

export default class ViewerDrive extends Viewer {
  constructor() {
    super()
    //Viewer type
    this.audioViewer = getElementWithTestId('viewer-audio')
    this.audioViewerControls = this.audioViewer.find('audio')
    this.txtViewer = getElementWithTestId('viewer-text')
    this.txtViewerContent = this.txtViewer.find(
      '[class*="pho-viewer-textviewer-content"]'
    )
    this.videoViewer = getElementWithTestId('viewer-video')
    this.videoViewerControls = this.videoViewer.find('video')
    this.noViewer = getElementWithTestId('viewer-noviewer')
    this.btnNoViewerDownload = this.noViewer.find('button')

    this.pdfViewer = getElementWithTestId('viewer-pdf')
    this.btnPdfViewerDownload = this.pdfViewer.find('#download')
  }

  //@param {String} fileName
  async openViewerForFile(fileName) {
    await t
      .expect(drivePage.folderOrFileName.withText(fileName).exists)
      .ok(`No folder named ${fileName}`)
      .click(drivePage.folderOrFileName.withText(fileName))

    await this.waitForLoading()
    console.log(`Navigation to ${fileName} OK!`)
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {string} fileStartName : file to open to start the navigation testing
  //@param {number} numberOfNavigation : the number of file we want to go through during the test.
  async checkViewerNavigation(
    screenshotPath,
    fileStartName,
    numberOfNavigation
  ) {
    const startIndex = await drivePage.getElementIndex(fileStartName)
    console.log(`↳ 📁 ${fileStartName} with index : ${startIndex}`)
    await this.openViewerForFile(fileStartName)
    await this.navigateInViewer(screenshotPath, startIndex, numberOfNavigation)
    await this.closeViewer({
      exitWithEsc: false
    })
  }

  // perform checks commons to all viewer : navigation / toolbar download btn / closing viewer, for one file
  async checkCommonViewerControls(folderName, fileName) {
    const index = await drivePage.getElementIndex(fileName)
    console.log(`↳ 📁 ${fileName} with index : ${index}`)
    await this.openViewerForFile(fileName)
    await t.takeScreenshot()

    await this.navigateToNextFile(index)
    await this.closeViewer({
      exitWithEsc: true
    })

    await this.openViewerForFile(fileName)
    await this.navigateToPrevFile(index)
    await this.closeViewer({
      exitWithEsc: false
    })
    const breadcrumbEnd = await drivePage.getbreadcrumb()
    await t.expect(breadcrumbEnd).contains(`${folderName}`)
  }

  //download using the common download button
  async openFileAndCheckCommonViewerDownload(fileName) {
    await this.openViewerForFile(fileName)
    await this.checkCommonViewerDownload()
    await this.closeViewer({
      exitWithEsc: true
    })
  }

  //Specific check for audioViewer
  async checkAudioViewer() {
    await isExistingAndVisibile(this.audioViewer, 'Audio viewer')
    await isExistingAndVisibile(
      this.audioViewerControls,
      'Audio viewer controls'
    )
    if (t.fixtureCtx.isVR) {
      //wait for file to load to get a good screenshots
      await t.wait(5000)
    }
  }

  //Specific check for videoViewer
  async checkVideoViewer() {
    await isExistingAndVisibile(this.videoViewer, 'Video viewer')
    await isExistingAndVisibile(
      this.videoViewerControls,
      'Video viewer controls'
    )
    if (t.fixtureCtx.isVR) {
      //wait for file to load to get a good screenshots
      await t.wait(5000)
    }
  }

  //Specific check for textViewer
  async checkTextViewer() {
    await isExistingAndVisibile(this.txtViewer, 'text viewer')
    await isExistingAndVisibile(this.txtViewerContent, 'text viewer controls')
  }

  //Specific check for no viewer : other download btn
  async checkNoViewer() {
    await isExistingAndVisibile(this.noViewer, 'no-viewer Viewer')
  }

  //Specific check for no viewer : other download btn
  async checkNoViewerDownload() {
    await isExistingAndVisibile(
      this.btnNoViewerDownload,
      'no Viewer Download button'
    )
    await t.setNativeDialogHandler(() => true).click(this.btnNoViewerDownload)
  }

  //Specific check for pdf viewer : download btn
  async checkPdfViewer() {
    await t.takeScreenshot()
    await isExistingAndVisibile(this.pdfViewer, 'Pdf Viewer')
  }
}
