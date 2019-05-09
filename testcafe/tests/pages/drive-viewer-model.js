import { t, Selector } from 'testcafe'
import {
  getPageUrl,
  getElementWithTestId,
  isExistingAndVisibile
} from '../helpers/utils'
import DrivePage from '../pages/drive-model'

const drivePage = new DrivePage()

export default class Page {
  constructor() {
    this.spinner = Selector('[class*="c-spinner"]')
    this.viewerWrapper = getElementWithTestId('viewer-wrapper')
    this.viewerControls = getElementWithTestId('pho-viewer-controls')
    this.viewerToolbar = getElementWithTestId('viewer-toolbar')
    this.btnDownloadViewerToolbar = getElementWithTestId(
      'viewer-toolbar-download'
    )

    // Navigation in viewer
    this.viewerNavNext = getElementWithTestId('viewer-nav--next')
    this.viewerNavNextBtn = this.viewerNavNext.find(
      '[class*="pho-viewer-nav-arrow"]'
    )
    this.viewerNavPrevious = getElementWithTestId('viewer-nav--previous')
    this.viewerNavPreviousBtn = this.viewerNavPrevious.find(
      '[class*="pho-viewer-nav-arrow"]'
    )
    this.viewerBtnClose = getElementWithTestId('btn-viewer-toolbar-close')

    //Viewer type
    this.audioViewer = getElementWithTestId('viewer-audio')
    this.audioViewerControls = this.audioViewer.find('audio')
    this.imageViewer = getElementWithTestId('viewer-image')
    this.imageViewerContent = this.imageViewer.find('img')
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

  async waitForLoading() {
    await t.expect(this.spinner.exists).notOk('Spinner still spinning')
    await isExistingAndVisibile(this.viewerWrapper, 'Viewer Wrapper')
    await isExistingAndVisibile(this.viewerControls, 'Viewer Controls')
    await isExistingAndVisibile(this.viewerToolbar, 'Viewer Toolbar')
    console.log('Viewer Ok')
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

  //@param { bool } exitWithEsc : true to exit by pressing esc, false to click on the button
  async closeViewer(exitWithEsc) {
    await t.hover(this.viewerWrapper)
    await isExistingAndVisibile(this.viewerBtnClose, 'Close button')
    exitWithEsc ? await t.pressKey('esc') : await t.click(this.viewerBtnClose)
  }

  //@param {number} index: index of open file (need to know if it's first or last file)
  async navigateToNextFile(index) {
    if (index == t.ctx.totalFilesCount - 1) {
      //this is the last picture, so next button does not exist
      await t
        .expect(this.viewerNavNext.exists)
        .notOk('Next button on last picture')
    } else {
      const fileurl = await getPageUrl()
      await t
        .hover(this.viewerNavNext) //not last photo, so next button should exists
        .expect(this.viewerNavNextBtn.visible)
        .ok('Next arrow does not show up')
        .click(this.viewerNavNextBtn)

      const file2url = await getPageUrl()
      await t.expect(fileurl).notEql(file2url)
    }
  }

  //@param {number} index: index of open file (need to know if it's first or last file)
  async navigateToPrevFile(index) {
    if (index == 0) {
      //this is the 1st picture, so previous button does not exist
      await t
        .expect(this.viewerNavPrevious.exists)
        .notOk('Previous button on first picture')
    } else {
      const fileurl = await getPageUrl()
      await t
        .hover(this.viewerNavPrevious) //not 1st photo, so previous button should exists
        .expect(this.viewerNavPreviousBtn.visible)
        .ok('Previous arrow does not show up')
        .click(this.viewerNavPrevious)

      const file2url = await getPageUrl()
      await t.expect(fileurl).notEql(file2url)
    }
  }

  async downloadWithToolbar() {
    await t.hover(this.viewerWrapper)
    await isExistingAndVisibile(
      this.btnDownloadViewerToolbar,
      'Download button in toolbar'
    )
    await t
      .setNativeDialogHandler(() => true)
      .click(this.btnDownloadViewerToolbar)
  }

  // perform checks commons to all viewer : navigation / toolbar download btn / closing viewer
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

  async checkCommonViewerDownload(folderName, fileName) {
    await this.openViewerForFile(fileName)
    await this.downloadWithToolbar()
    await this.closeViewer({
      exitWithEsc: true
    })
  }

  //Specific check for audioViewer
  async checkAudioViewer(fileName) {
    await this.openViewerForFile(fileName)
    await t.takeScreenshot()

    await isExistingAndVisibile(this.audioViewer, 'Audio viewer')
    await isExistingAndVisibile(
      this.audioViewerControls,
      'Audio viewer controls'
    )
    await this.closeViewer({
      exitWithEsc: false
    })
  }

  //Specific check for videoViewer
  async checkVideoViewer(fileName) {
    await this.openViewerForFile(fileName)
    await t.takeScreenshot()

    await isExistingAndVisibile(this.videoViewer, 'Video viewer')
    await isExistingAndVisibile(
      this.videoViewerControls,
      'Video viewer controls'
    )
    await this.closeViewer({
      exitWithEsc: false
    })
  }

  //Specific check for textViewer
  async checkTextViewer(fileName) {
    await this.openViewerForFile(fileName)
    await t.takeScreenshot()

    await isExistingAndVisibile(this.txtViewer, 'text viewer')
    await isExistingAndVisibile(this.txtViewerContent, 'text viewer controls')
    await this.closeViewer({
      exitWithEsc: false
    })
  }

  //Specific check for imageViewer
  async checkImageViewer(fileName) {
    await this.openViewerForFile(fileName)
    await t.takeScreenshot()

    await isExistingAndVisibile(this.imageViewer, 'image viewer')
    await isExistingAndVisibile(
      this.imageViewerContent,
      'image viewer controls'
    )
    await this.closeViewer({
      exitWithEsc: false
    })
  }

  //Specific check for no viewer : other download btn
  async checkNoViewer(fileName) {
    await this.openViewerForFile(fileName)
    await t.takeScreenshot()

    await isExistingAndVisibile(this.noViewer, 'no-viewer Viewer')
    await isExistingAndVisibile(
      this.btnNoViewerDownload,
      'no Viewer Download butoon'
    )
    await t.setNativeDialogHandler(() => true).click(this.btnNoViewerDownload)

    await this.closeViewer({
      exitWithEsc: true
    })
  }

  //Specific check for pdf viewer : download btn
  async checkPdfViewer(fileName) {
    await this.openViewerForFile(fileName)
    await t.takeScreenshot()
    await isExistingAndVisibile(this.pdfViewer, 'Pdf Viewer')
    await this.closeViewer({
      exitWithEsc: true
    })
  }
}
