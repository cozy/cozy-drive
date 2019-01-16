//!FIXME Change selector (ID or react)
import { Selector, t } from 'testcafe'

export default class Page {
  constructor() {
    this.nameInput = Selector('#developer-name')

    this.btnUpload = Selector('[class*="pho-toolbar"]')
      .find('span')
      .find('input')
    this.divUpload = Selector('[class*="upload-queue"]')

    this.modalUpload = Selector('[class*="c-alert-wrapper"]', {
      visibilityCheck: true
    })

    this.photoThumb = value => {
      return Selector('[class*="pho-photo-item"]').nth(value)
    }

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
    this.photoToolbar = Selector(
      '[class*="coz-selectionbar pho-viewer-toolbar-actions"]'
    ) //.find('button') -> DL button

    this.photoCheckbox = Selector(
      '[class*="pho-photo-select"][data-input="checkbox"]'
    )
    //Top Option bar & Confirmation Modal
    this.barPhoto = Selector('[class*="coz-selectionbar"]')
    this.barPhotoBtnAddtoalbum = this.barPhoto.find('button').nth(0) //ADD TO ALBUM
    this.barPhotoBtnDl = this.barPhoto.find('button').nth(1) //DOWNLOAD
    this.barPhotoBtnDelete = this.barPhoto.find('button').nth(2) //DELETE
    this.modalDelete = Selector('[class*="c-modal"]').find('div')
    this.modalDeleteBtnDelete = this.modalDelete.find('button').nth(2) //REMOVE
    this.allPhotos = Selector('[class*="pho-photo"]').find(
      '[class*="pho-photo-item"]'
    )
  }

  async uploadPhotos(files) {
    const numOfFiles = files.length
    console.log('Uploading  ' + numOfFiles + ' picture(s)')

    await t
      .setFilesToUpload(this.btnUpload, files)
      .expect(this.divUpload.visible)
      .ok('Upload pop-in does not show up')
      .expect(this.modalUpload.exists)
      .ok({ timeout: 50000 })
      .expect(this.divUpload.child('h4').innerText)
      .match(
        new RegExp('([' + numOfFiles + '].*){2}'),
        'Numbers of pictures uploaded does not match'
      )
    await t.takeScreenshot()

    const allPhotosEndCount = await this.allPhotos.count //Pics count at the end
    console.log(
      'Number of pictures on page (After test):  ' + allPhotosEndCount
    )
    await t
      .expect(allPhotosEndCount)
      .eql(t.ctx.allPhotosStartCount + numOfFiles)
  }

  async deletePhotos(numOfFiles) {
    console.log('Deleting  ' + numOfFiles + ' picture(s)')

    await t.hover(page.photoThumb(0)) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked
    for (i = 0; i < numOfFiles - 1; i++) {
      await t.click(page.photoCheckbox.nth(i)) //Index
    }
    await t
      .expect(page.barPhoto.visible)
      .ok()

      .click(page.barPhotoBtnDelete)
      .expect(page.modalDelete.visible)
      .ok()
      .click(page.modalDeleteBtnDelete)
    await t.takeScreenshot()

    const allPhotosEndCount = await page.allPhotos.count //Pics count at the end
    console.log(
      'Number of pictures on page (After test):  ' + allPhotosEndCount
    )

    await t
      .expect(allPhotosEndCount)
      .eql(t.ctx.allPhotosStartCount - numOfFiles)
  }
}
