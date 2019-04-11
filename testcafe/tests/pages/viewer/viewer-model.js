import { t } from 'testcafe'
import { isExistingAndVisibile } from '../../helpers/utils'
import * as selectors from '../selectors'

export default class Viewer {
  async waitForLoading() {
    await t.expect(selectors.spinner.exists).notOk('Spinner still spinning')
    await isExistingAndVisibile(selectors.viewerWrapper, 'Viewer Wrapper')
    await isExistingAndVisibile(selectors.viewerControls, 'Viewer Controls')
    console.log('Viewer Ok')
  }

  //@param { bool } exitWithEsc : true to exit by pressing esc, false to click on the button
  async closeViewer(exitWithEsc) {
    await t.hover(selectors.viewerWrapper)
    await isExistingAndVisibile(selectors.viewerBtnClose, 'Close button')
    exitWithEsc
      ? await t.pressKey('esc')
      : await t.click(selectors.viewerBtnClose)
  }

  //@param {number} index: index of open file (need to know if it's first or last file)
  async navigateToNextFile(index) {
    if (index == t.ctx.totalFilesCount - 1) {
      //this is the last picture, so next button does not exist
      await t
        .expect(selectors.viewerNavNext.exists)
        .notOk('Next button on last picture')
    } else {
      await t
        .hover(selectors.viewerNavNext) //not last photo, so next button should exists
        .expect(selectors.btnViewerNavNext.visible)
        .ok('Next arrow does not show up')
        .click(selectors.btnViewerNavNext)
      await this.waitForLoading()
    }
  }

  //@param {number} index: index of open file (need to know if it's first or last file)
  async navigateToPrevFile(index) {
    if (index == 0) {
      //this is the 1st picture, so previous button does not exist
      await t
        .expect(selectors.viewerNavPrevious.exists)
        .notOk('Previous button on first picture')
    } else {
      await t
        .hover(selectors.viewerNavPrevious) //not 1st photo, so previous button should exists
        .expect(selectors.btnViewerNavPrevious.visible)
        .ok('Previous arrow does not show up')
        .click(selectors.viewerNavPrevious)
      await this.waitForLoading()
    }
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {number} startIndex : index of the 1st file to open
  //@param {number} numberOfNavigation : the number of file we want to go through during the test.
  async navigateInViewer(screenshotPath, startIndex, numberOfNavigation) {
    console.log(
      `startIndex : ${startIndex} / numberOfNavigation : ${numberOfNavigation}`
    )
    for (let i = startIndex; i < startIndex + numberOfNavigation; i++) {
      await this.navigateToNextFile(i)
      if (t.fixtureCtx.isVR)
        await t.fixtureCtx.vr.takeScreenshotAndUpload(
          `${screenshotPath}-${i}-next`
        )
    }

    for (let i = startIndex + numberOfNavigation - 1; i > startIndex; i--) {
      console.log(` i : ${i} `)

      await this.navigateToPrevFile(i)
      if (t.fixtureCtx.isVR)
        await t.fixtureCtx.vr.takeScreenshotAndUpload(
          `${screenshotPath}-${i}-prev`
        )
    }
  }

  //download using the common download button
  async checkCommonViewerDownload() {
    await t.hover(selectors.viewerWrapper)
    await isExistingAndVisibile(
      selectors.btnDownloadViewerToolbar,
      'Download button in toolbar'
    )
    await t
      .setNativeDialogHandler(() => true)
      .click(selectors.btnDownloadViewerToolbar)
  }

  //Specific check for imageViewer (Common to drive/photos)
  async checkImageViewer() {
    await isExistingAndVisibile(selectors.imageViewer, 'image viewer')
    await isExistingAndVisibile(
      selectors.imageViewerContent,
      'image viewer controls'
    )
  }
}
