import { t } from 'testcafe'
import logger from '../../helpers/logger'
import { isExistingAndVisibile } from '../../helpers/utils'
import * as selectors from '../selectors'
import Commons from './photos-model'

export default class Timeline extends Commons {
  //timeline specific as selectors.contentWrapper is only on timeline
  async waitForLoading() {
    await t
      .expect(selectors.loading.exists)
      .notOk(
        'waitForLoading - Page didnt Load : selectors.loading still exists'
      )
    await isExistingAndVisibile(
      selectors.contentWrapper,
      'waitForLoading - selectors.contentWrapper'
    )
    logger.debug(`photos-timeline-model : waitForLoading Ok`)
  }

  //@param {array of fileName} files
  async uploadPhotos(files) {
    const numOfFiles = files.length
    logger.debug('Uploading ' + numOfFiles + ' picture(s)')

    await t.expect(selectors.btnUpload.exists).ok(`Upload button doesnt exist`)
    await t.setFilesToUpload(selectors.btnUpload, files)
    await isExistingAndVisibile(selectors.divUpload, 'selectors.divUpload')
    await isExistingAndVisibile(
      selectors.divUploadSuccess,
      'selectors.divUploadSuccess'
    )
    await isExistingAndVisibile(
      selectors.alertWrapper,
      'selectors.alertWrapper'
    )
    await t
      .expect(selectors.divUpload.innerText)
      .match(
        new RegExp('([' + numOfFiles + '].*){2}'),
        'Numbers of pictures uploaded does not match'
      )
    await t.takeScreenshot()
    const allPhotosEndCount = await this.getPhotosCount('After')
    await t.expect(allPhotosEndCount).eql(t.ctx.totalFilesCount + numOfFiles)
  }

  async checkCozyBarOnTimeline() {
    await isExistingAndVisibile(
      selectors.cozySelectionbar,
      'selectors.cozySelectionbar'
    )
    await isExistingAndVisibile(
      selectors.btnAddToAlbumCozySelectionBar,
      'selectors.btnAddToAlbumCozySelectionBar'
    )
    await isExistingAndVisibile(
      selectors.btnDownloadCozySelectionBar,
      'selectors.btnDownloadCozySelectionBar'
    )
    await isExistingAndVisibile(
      selectors.btnDeleteCozySelectionBar,
      'selectors.btnDeleteCozySelectionBar'
    )
  }

  //@param { number } numOfFiles : number of file to delete
  async deletePhotosFromTimeline({
    numOfFiles: numOfFiles,
    screenshotPath: screenshotPath,
    withMask = false
  }) {
    await isExistingAndVisibile(
      selectors.cozySelectionbar,
      'selectors.cozySelectionbar'
    )

    logger.debug('Deleting ' + numOfFiles + ' picture(s)')
    await isExistingAndVisibile(
      selectors.btnDeleteCozySelectionBar,
      'selectors.btnDeleteCozySelectionBar'
    )
    await t.click(selectors.btnDeleteCozySelectionBar)

    await isExistingAndVisibile(selectors.modalFooter, 'selectors.modalFooter')
    await isExistingAndVisibile(
      selectors.btnModalSecondButton,
      'selectors.btnModalSecondButton'
    )
    if (t.fixtureCtx.isVR)
      //dates show up here, so there is a mask for screenshots
      await t.fixtureCtx.vr.takeScreenshotAndUpload({
        screenshotPath: screenshotPath,
        withMask: withMask
      })

    await t.click(selectors.btnModalSecondButton)

    if (!t.fixtureCtx.isVR) {
      let allPhotosEndCount = await this.getPhotosCount('After')
      await t.expect(allPhotosEndCount).eql(t.ctx.totalFilesCount - numOfFiles)
    }
  }
}
