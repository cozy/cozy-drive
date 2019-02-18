//!FIXME Change selector (ID or react)
import { Selector, t } from 'testcafe'
import {
  getPageUrl,
  getElementWithTestId,
  getElementWithTestItem,
  isExistingAndVisibile,
  checkAllImagesExists
} from '../helpers/utils'

export default class Page {
  constructor() {
    this.loading = getElementWithTestId('loading')
    this.photoSection = getElementWithTestId('photo-section')
    this.folderEmpty = getElementWithTestId('empty-folder')
    this.contentWrapper = getElementWithTestId('timeline-pho-content-wrapper')

    // Upload
    this.btnUpload = getElementWithTestId('upload-btn')
    this.divUpload = getElementWithTestId('upload-queue')
    this.divUploadSuccess = getElementWithTestId('upload-queue-success')
    this.modalUpload = Selector('[class*="c-alert-wrapper"]')

    //thumbnails
    this.photoThumb = value => {
      return getElementWithTestItem('pho-photo-item').nth(value)
    }
    this.photoToolbar = Selector(
      '[class*="coz-selectionbar pho-viewer-toolbar-actions"]'
    )

    this.photoCheckbox = Selector(
      '[class*="pho-photo-select"][data-input="checkbox"]'
    )
    //Top Option bar & Confirmation Modal
    this.barPhoto = Selector('[class*="coz-selectionbar"]')
    //those buttons are defined in cozy-ui (SelectionBar), so we cannot add data-test-id on them
    this.barPhotoBtnAddtoalbum = this.barPhoto.find('button').nth(0) //ADD TO ALBUM
    this.barPhotoBtnDl = this.barPhoto.find('button').nth(1) //DOWNLOAD
    this.barPhotoBtnDeleteOrRemove = this.barPhoto.find('button').nth(2) //DELETE OR REMOVE FROM ALBUM
    this.modalDelete = Selector('[class*="c-modal"]').find('div')
    this.modalDeleteBtnDelete = this.modalDelete.find('button').nth(2) //REMOVE

    this.allPhotosWrapper = this.photoSection.find('[class^="pho-photo"]')
    this.allPhotos = getElementWithTestItem('pho-photo-item')

    // Photo fullscreen
    this.photoFull = Selector('[class*="pho-viewer-imageviewer"]').find('img')
    this.photoNavNext = Selector('[class*="pho-viewer-nav--next"]')
    this.photoNavNextBtn = this.photoNavNext.find(
      '[class*="pho-viewer-nav-arrow"]'
    )
    this.photoNavPrevious = Selector('[class*="pho-viewer-nav--previous"]')
    this.photoNavPreviousBtn = this.photoNavPrevious.find(
      '[class*="pho-viewer-nav-arrow"]'
    )
    this.photoBtnClose = Selector('[class*="pho-viewer-toolbar-close"]').find(
      '[class*="c-btn"]'
    )

    //Sidebar
    this.sidebar = Selector('[class*="pho-sidebar"]')
    this.btnNavToAlbum = getElementWithTestId('nav-to-albums')
  }

  async waitForLoading() {
    await t.expect(this.loading.exists).notOk('Page still loading')
    await isExistingAndVisibile(this.contentWrapper, 'Content Wrapper')
  }

  async initPhotoCountZero() {
    await isExistingAndVisibile(this.folderEmpty, 'Folder Empty')
    console.log(`Number of pictures on page (Before test): 0`)
    t.ctx.allPhotosStartCount = 0
  }

  async initPhotosCount() {
    t.ctx.allPhotosStartCount = await this.getPhotosCount('Before')
  }

  //@param {string} when : text for console.log
  //photoCount still failed sometimes, so let's try twice
  async getPhotosCount(when) {
    await checkAllImagesExists()
    await isExistingAndVisibile(this.photoSection, 'photo Section')
    await isExistingAndVisibile(this.allPhotosWrapper, 'Picture wrapper')
    await isExistingAndVisibile(this.allPhotos, 'Photo item(s)')
    const allPhotosCount = await this.allPhotos.count

    console.log(`Number of pictures on page (${when} test):  ${allPhotosCount}`)

    return allPhotosCount
  }

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
    await isExistingAndVisibile(this.modalUpload, 'Photo(s) uploaded')
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

  async selectPhotos(numOfFiles) {
    console.log('Selecting ' + numOfFiles + ' picture(s)')
    await isExistingAndVisibile(this.photoThumb(0), '1st Photo thumb')
    await t.hover(this.photoThumb(0)) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked

    for (let i = 0; i < numOfFiles; i++) {
      await isExistingAndVisibile(this.photoThumb(i), `${i + 1}th Photo thumb`)
      await t.click(this.photoCheckbox.nth(i))
    }
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
    //!FIXME Add check on label text
  }

  async openPhotoFullscreen(index) {
    await isExistingAndVisibile(
      this.photoThumb(index),
      `${index}th Photo thumb`
    )

    await t.click(this.photoThumb(index))
    await isExistingAndVisibile(this.photoFull, 'fullscreen photos')
  }

  async closePhotoFullscreenX() {
    //Pic closed using Button
    await isExistingAndVisibile(this.photoBtnClose, 'Button Close')
    await t
      .click(this.photoBtnClose)
      .expect(this.photoFull.exists)
      .notOk('Photo is still in fullscreen view')
  }

  async closePhotoFullscreenEsc() {
    //Pic closed using 'esc'
    await t
      .pressKey('esc')
      .expect(this.photoFull.exists)
      .notOk('Photo is still in fullscreen view')
  }

  async navigateToNextPhoto(index) {
    if (index == t.ctx.allPhotosStartCount - 1) {
      //this is the last picture, so next button does not exist
      await t
        .expect(this.photoNavNext.exists)
        .notOk('Next button on last picture')
    } else {
      const photo1src = await this.photoFull.getAttribute('src')
      const photo1url = await getPageUrl()
      await isExistingAndVisibile(this.photoNavNext, 'Div photo Next')
      await t.hover(this.photoNavNext) //not last photo, so next button should exists
      await isExistingAndVisibile(this.photoNavNextBtn, 'Next arrow')
      await t.click(this.photoNavNextBtn)

      const photo2src = await this.photoFull.getAttribute('src')
      const photo2url = await getPageUrl()
      //Photo has change, so src & url are different
      await isExistingAndVisibile(this.photoFull, '(next) fullscreen photos')
      await t.expect(photo1src).notEql(photo2src)
      await t.expect(photo1url).notEql(photo2url)
      //!FIXME add data-photo-id=xxx in photo and check url=#/photos/xxx
    }
  }

  async navigateToPrevPhoto(index) {
    if (index == 0) {
      //this is the 1st picture, so previous button does not exist
      await t
        .expect(this.photoNavPrevious.exists)
        .notOk('Previous button on first picture')
    } else {
      const photo1src = await this.photoFull.getAttribute('src')
      const photo1url = await getPageUrl()
      await isExistingAndVisibile(this.photoNavPrevious, 'Div photo prev')

      await t.hover(this.photoNavPrevious) //not 1st photo, so previous button should exists
      await isExistingAndVisibile(this.photoNavPreviousBtn, 'prev arrow')
      await t.click(this.photoNavPreviousBtn)

      const photo2src = await this.photoFull.getAttribute('src')
      const photo2url = await getPageUrl()
      //Photo has change, so src & url are different
      await isExistingAndVisibile(this.photoFull, '(prev) fullscreen photos')
      await t.expect(photo1src).notEql(photo2src)
      await t.expect(photo1url).notEql(photo2url)
      //!FIXME add data-photo-id=xxx in photo and check url=#/photos/xxx
    }
  }

  //@param { number } numOfFiles : number of file to delete
  //@param { bool } isRemoveAll: true if all photos are supposed to be remove at the end
  async deletePhotos(numOfFiles, isRemoveAll) {
    await isExistingAndVisibile(this.barPhoto, 'Selection bar')

    console.log('Deleting ' + numOfFiles + ' picture(s)')
    await isExistingAndVisibile(this.barPhotoBtnDeleteOrRemove, 'Delete Button')
    await t.click(this.barPhotoBtnDeleteOrRemove)

    await isExistingAndVisibile(this.modalDelete, 'Modal delete')
    await isExistingAndVisibile(
      this.modalDeleteBtnDelete,
      'Modal delete button Delete'
    )
    await t.click(this.modalDeleteBtnDelete)
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

  async goToAlbums() {
    await isExistingAndVisibile(this.sidebar, 'Sidebar')
    await isExistingAndVisibile(this.btnNavToAlbum, 'Album Button')
    await t
      .click(this.btnNavToAlbum)
      .expect(getPageUrl())
      .contains('albums')
  }
}
