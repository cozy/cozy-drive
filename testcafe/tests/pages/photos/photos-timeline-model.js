import { t } from 'testcafe'
import logger from '../../helpers/logger'
import { isExistingAndVisible } from '../../helpers/utils'
import * as selectors from '../selectors'
import Commons from './photos-model'

export default class Timeline extends Commons {
  //timeline specific as selectors.contentWrapper is only on timeline
  async waitForLoading() {
    await t
      .expect(selectors.loading.exists)
      .notOk('Page didnt Load : selectors.loading still exists')
    await isExistingAndVisible('selectors.contentWrapper')
    logger.debug(`photos-timeline-model : waitForLoading Ok`)
  }

  //@param {array of fileName} files
  async uploadPhotos(files) {
    const numOfFiles = files.length
    logger.debug('Uploading ' + numOfFiles + ' picture(s)')

    await t
      .expect(selectors.btnUpload.exists)
      .ok(`selectors.btnUpload doesnt exist`)
    await t.setFilesToUpload(selectors.btnUpload, files)
    await isExistingAndVisible('selectors.divUpload')
    await isExistingAndVisible('selectors.divUploadSuccess')
    await isExistingAndVisible('selectors.alertWrapper')
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
    await isExistingAndVisible('selectors.cozySelectionbar')
    await isExistingAndVisible('selectors.btnAddToAlbumCozySelectionBar')
    await isExistingAndVisible('selectors.btnDownloadCozySelectionBar')
    await isExistingAndVisible('selectors.btnDeleteCozySelectionBar')
  }

  //@param { number } numOfFiles : number of file to delete
  async deletePhotosFromTimeline({
    numOfFiles: numOfFiles,
    screenshotPath: screenshotPath,
    withMask = false
  }) {
    await isExistingAndVisible('selectors.cozySelectionbar')
    logger.debug('Deleting ' + numOfFiles + ' picture(s)')
    await isExistingAndVisible('selectors.btnDeleteCozySelectionBar')
    await t.click(selectors.btnDeleteCozySelectionBar)

    await isExistingAndVisible('selectors.modalFooter')
    await isExistingAndVisible('selectors.btnModalSecondButton')
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
