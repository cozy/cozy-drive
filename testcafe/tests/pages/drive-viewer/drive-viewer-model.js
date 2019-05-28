import logger from '../../helpers/logger'
import { t } from 'testcafe'
import { isExistingAndVisibile } from '../../helpers/utils'
import DrivePage from '../drive/drive-model'
import Viewer from '../viewer/viewer-model'
import { THUMBNAIL_DELAY } from '../../helpers/data'
import * as selectors from '../selectors'

const drivePage = new DrivePage()

export default class ViewerDrive extends Viewer {
  //@param {String} fileName
  async openViewerForFile(fileName) {
    await t
      .expect(selectors.folderOrFileName.withText(fileName).exists)
      .ok(`No folder named ${fileName}`)
      .click(selectors.folderOrFileName.withText(fileName))

    await this.waitForLoading()
  }

  async openViewerForFileIndex(fileIndex) {
    await t
      .expect(selectors.folderOrFileName.nth(fileIndex).exists)
      .ok(`No file with index ${fileIndex}`)
      .click(selectors.folderOrFileName.nth(fileIndex))

    await this.waitForLoading()
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {string} fileStartName : file to open to start the navigation testing
  //@param {number} numberOfNavigation : the number of file we want to go through during the test.
  async checkViewerNavigation({
    screenshotPath: screenshotPath,
    fileStartName: fileStartName,
    numberOfNavigation: numberOfNavigation
  }) {
    const startIndex = await drivePage.getElementIndex(fileStartName)
    logger.info(`↳ 📁 ${fileStartName} with index : ${startIndex}`)
    await this.openViewerForFile(fileStartName)
    await this.navigateInViewer({
      screenshotPath: screenshotPath,
      startIndex: startIndex,
      numberOfNavigation: numberOfNavigation
    })
    await this.closeViewer({
      exitWithEsc: false
    })
  }

  // perform checks commons to all viewer : navigation / toolbar download btn / closing viewer, for one file
  async openFileAndCheckCommonViewerControls(folderName, fileName) {
    const index = await drivePage.getElementIndex(fileName)
    logger.info(`↳ 📁 Check Viewer for ${fileName} with index : ${index}`)
    await this.openViewerForFile(fileName)
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
    await isExistingAndVisibile(selectors.audioViewer, 'selectors.audioViewer')
    await isExistingAndVisibile(
      selectors.audioViewerControls,
      'selectors.audioViewerControls'
    )
    if (t.fixtureCtx.isVR) {
      //wait for file to load to get a good screenshots
      await t.wait(THUMBNAIL_DELAY)
    }
  }

  //Specific check for videoViewer
  async checkVideoViewer() {
    await isExistingAndVisibile(selectors.videoViewer, 'selectors.videoViewer')
    await isExistingAndVisibile(
      selectors.videoViewerControls,
      'selectors.videoViewerControls'
    )
    if (t.fixtureCtx.isVR) {
      //wait for file to load to get a good screenshots
      await t.wait(THUMBNAIL_DELAY)
    }
  }

  //Specific check for textViewer
  async checkTextViewer() {
    await isExistingAndVisibile(selectors.txtViewer, 'selectors.txtViewer')
    await isExistingAndVisibile(
      selectors.txtViewerContent,
      'selectors.txtViewerContent'
    )
  }

  //Specific check for no viewer : other download btn
  async checkNoViewer() {
    await isExistingAndVisibile(selectors.noViewer, 'selectors.noViewer')
  }

  //Specific check for no viewer : other download btn
  async checkNoViewerDownload() {
    await isExistingAndVisibile(
      selectors.btnNoViewerDownload,
      'selectors.btnNoViewerDownload'
    )
    await t
      .setNativeDialogHandler(() => true)
      .click(selectors.btnNoViewerDownload)
  }

  //Specific check for pdf viewer : download btn
  async checkPdfViewer() {
    await t.takeScreenshot()
    await isExistingAndVisibile(selectors.pdfViewer, 'selectors.pdfViewer')
  }
}
