import { t } from 'testcafe'
import logger from '../../helpers/logger'
import { isExistingAndVisibile } from '../../helpers/utils'
import * as selectors from '../selectors'
import Commons from './photos-model'

export default class Timeline extends Commons {
  //timeline specific as selectors.contentWrapper is only on timeline
  async waitForLoading() {
    await t.expect(selectors.loading.exists).notOk('Page still loading')
    await isExistingAndVisibile(selectors.contentWrapper, 'Content Wrapper')
  }

  //@param {array of fileName} files
  async uploadPhotos(files) {
    const numOfFiles = files.length
    logger.debug('Uploading ' + numOfFiles + ' picture(s)')

    await isExistingAndVisibile(selectors.btnUpload, 'Upload Button')
    await t.setFilesToUpload(selectors.btnUpload, files)
    await isExistingAndVisibile(selectors.divUpload, 'Upload div')
    await isExistingAndVisibile(
      selectors.divUploadSuccess,
      'Upload pop-in successfull'
    )
    await isExistingAndVisibile(selectors.alertWrapper, 'Photo(s) uploaded')
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
    await isExistingAndVisibile(selectors.cozySelectionbar, 'Selection bar')
    await isExistingAndVisibile(
      selectors.btnAddToAlbumCozySelectionBar,
      'Button "Add to Album"'
    )
    await isExistingAndVisibile(
      selectors.btnDownloadCozySelectionBar,
      'Button "Download"'
    )
    await isExistingAndVisibile(
      selectors.btnDeleteCozySelectionBar,
      'Button "Delete"'
    )
  }

  //@param { number } numOfFiles : number of file to delete
  //@param { bool } isRemoveAll: true if all photos are supposed to be remove at the end
  async deletePhotosFromTimeline(numOfFiles, isRemoveAll) {
    await isExistingAndVisibile(selectors.cozySelectionbar, 'Selection bar')

    logger.debug('Deleting ' + numOfFiles + ' picture(s)')
    await isExistingAndVisibile(
      selectors.btnDeleteCozySelectionBar,
      'Delete Button'
    )
    await t.click(selectors.btnDeleteCozySelectionBar)

    await isExistingAndVisibile(selectors.modalFooter, 'Modal delete')
    await isExistingAndVisibile(
      selectors.btnModalSecondButton,
      'Modal delete button Delete'
    )
    await t.click(selectors.btnModalSecondButton)
    await t.takeScreenshot()

    let allPhotosEndCount
    if (isRemoveAll) {
      await isExistingAndVisibile(selectors.folderEmpty, 'Folder Empty')
      logger.debug(`Number of pictures on page (Before test): 0`)
      allPhotosEndCount = 0
    } else {
      allPhotosEndCount = await this.getPhotosCount('After')
    }

    await t.expect(allPhotosEndCount).eql(t.ctx.totalFilesCount - numOfFiles)
  }
}
