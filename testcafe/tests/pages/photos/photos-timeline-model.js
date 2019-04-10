import { t } from 'testcafe'
import {
  getElementWithTestId,
  isExistingAndVisibile
} from '../../helpers/utils'
import { THUMBNAIL_DELAY } from '../../helpers/data'
import Commons from './photos-model'

export default class Timeline extends Commons {
  constructor() {
    super()
    this.contentWrapper = getElementWithTestId('timeline-pho-content-wrapper')

    // Upload
    this.btnUpload = getElementWithTestId('upload-btn')
    this.divUpload = getElementWithTestId('upload-queue')
    this.divUploadSuccess = getElementWithTestId('upload-queue-success')

    //those buttons are defined in cozy-ui (SelectionBar), so we cannot add data-test-id on them
    //TIMELINE
    this.barPhotoBtnAddtoalbum = this.barPhoto.find('button').nth(0) //ADD TO ALBUM
    this.barPhotoBtnDl = this.barPhoto.find('button').nth(1) //DOWNLOAD
    this.barPhotoBtnDeleteOrRemove = this.barPhoto.find('button').nth(2) //DELETE OR REMOVE FROM ALBUM
  }
  //@param {array of fileName} files
  async uploadPhotos(files) {
    const numOfFiles = files.length
    console.log('Uploading ' + numOfFiles + ' picture(s)')

    await isExistingAndVisibile(this.btnUpload, 'Upload Button')
    await t.setFilesToUpload(this.btnUpload, files)
    await isExistingAndVisibile(this.divUpload, 'Upload div')
    await isExistingAndVisibile(
      this.divUploadSuccess,
      'Upload pop-in successfull'
    )
    await isExistingAndVisibile(this.alertWrapper, 'Photo(s) uploaded')
    await t
      .expect(this.divUpload.innerText)
      .match(
        new RegExp('([' + numOfFiles + '].*){2}'),
        'Numbers of pictures uploaded does not match'
      )
    await t.takeScreenshot()
    const allPhotosEndCount = await this.getPhotosCount('After')
    await t
      .expect(allPhotosEndCount)
      .eql(t.ctx.allPhotosStartCount + numOfFiles)
  }

  async takeScreenshotsForUpload(screenshotsPath, hasMask = false) {
    await t.fixtureCtx.vr.takeElementScreenshotAndUpload(
      this.divUpload,
      `${screenshotsPath}-Divupload`
    )
    //add wait to avoid thumbnail error on screenshots
    await t.wait(THUMBNAIL_DELAY)
    //relaod page to load thumbnails
    await t.eval(() => location.reload(true))
    await this.waitForLoading()
    await checkAllImagesExists()

    await t.fixtureCtx.vr.takeScreenshotAndUpload(screenshotsPath, hasMask)
  }

  async checkPhotobar() {
    await isExistingAndVisibile(this.barPhoto, 'Selection bar')
    await isExistingAndVisibile(
      this.barPhotoBtnAddtoalbum,
      'Button "Add to Album"'
    )
    await isExistingAndVisibile(this.barPhotoBtnDl, 'Button "Download"')
    await isExistingAndVisibile(
      this.barPhotoBtnDeleteOrRemove,
      'Button "Delete"'
    )
  }

  //timeline specific as this.contentWrapper is only on timeline
  async waitForLoading() {
    await t.expect(this.loading.exists).notOk('Page still loading')
    await isExistingAndVisibile(this.contentWrapper, 'Content Wrapper')
  }

  //@param { number } numOfFiles : number of file to delete
  //@param { bool } isRemoveAll: true if all photos are supposed to be remove at the end
  async deletePhotos(numOfFiles, isRemoveAll) {
    await isExistingAndVisibile(this.barPhoto, 'Selection bar')

    console.log('Deleting ' + numOfFiles + ' picture(s)')
    await isExistingAndVisibile(this.barPhotoBtnDeleteOrRemove, 'Delete Button')
    await t.click(this.barPhotoBtnDeleteOrRemove)

    await isExistingAndVisibile(this.modalFooter, 'Modal delete')
    await isExistingAndVisibile(
      this.modalSecondButton,
      'Modal delete button Delete'
    )
    await t.click(this.modalSecondButton)
    await t.takeScreenshot()

    let allPhotosEndCount
    if (isRemoveAll) {
      await isExistingAndVisibile(this.folderEmpty, 'Folder Empty')
      console.log(`Number of pictures on page (Before test): 0`)
      allPhotosEndCount = 0
    } else {
      allPhotosEndCount = await this.getPhotosCount('After')
    }

    await t
      .expect(allPhotosEndCount)
      .eql(t.ctx.allPhotosStartCount - numOfFiles)
  }
}
