//!FIXME Change selector (ID or react)
import { Selector, t } from 'testcafe'
import {
  getPageUrl,
  getElementWithTestId,
  isExistingAndVisibile,
  checkAllImagesExists,
  getElementWithTestItem
} from '../../helpers/utils'

export default class Page {
  constructor() {
    this.folderEmpty = getElementWithTestId('empty-folder')
    this.loading = getElementWithTestId('loading')
    this.photoSection = getElementWithTestId('photo-section')

    //Sidebar
    this.sidebar = Selector('[class*="pho-sidebar"]')
    this.btnNavToAlbum = getElementWithTestId('nav-to-albums')

    //Top Option bar & Confirmation Modal
    this.barPhoto = Selector('[class*="coz-selectionbar"]')

    //Modal
    this.modalDelete = Selector('[class*="c-modal"]').find('div')
    this.modalDeleteBtnDelete = this.modalDelete.find('button').nth(2) //REMOVE
    this.alertWrapper = Selector('[class*="c-alert-wrapper"]')

    //thumbnails & photos
    this.allPhotosWrapper = this.photoSection.find('[class^="pho-photo"]')
    this.allPhotos = Selector('div').withAttribute('data-test-item')

    this.photoThumb = value => {
      return this.allPhotos.nth(value)
    }
    this.photoThumbByName = value => {
      return getElementWithTestItem(value)
    }
    this.photoThumbByNameCheckbox = value => {
      return this.photoThumbByName(value).find(
        '[class*="pho-photo-select"][data-input="checkbox"]'
      )
    }
    this.photoCheckbox = Selector(
      '[class*="pho-photo-select"][data-input="checkbox"]'
    )
    this.photoToolbar = Selector(
      '[class*="coz-selectionbar pho-viewer-toolbar-actions"]'
    )
  }

  async initPhotoCountZero() {
    console.log(`Number of pictures on page (Before test): 0`)
    t.ctx.allPhotosStartCount = 0
  }

  async initPhotosCount() {
    t.ctx.allPhotosStartCount = await this.getPhotosCount('Before')
  }

  async goToAlbums() {
    await isExistingAndVisibile(this.sidebar, 'Sidebar')
    await isExistingAndVisibile(this.btnNavToAlbum, 'Album Button')
    await t
      .click(this.btnNavToAlbum)
      .expect(getPageUrl())
      .contains('albums')
  }

  //@param {string} when : text for console.log
  async getPhotosCount(when) {
    await checkAllImagesExists()
    await isExistingAndVisibile(this.photoSection, 'photo Section')
    await isExistingAndVisibile(this.allPhotosWrapper, 'Picture wrapper')
    await isExistingAndVisibile(this.allPhotos, 'Photo item(s)')
    const allPhotosCount = await this.allPhotos.count

    console.log(`Number of pictures on page (${when} test):  ${allPhotosCount}`)

    return allPhotosCount
  }

  //@param { number } numOfFiles : number of file to select
  async selectPhotos(numOfFiles) {
    console.log('Selecting ' + numOfFiles + ' picture(s)')
    await isExistingAndVisibile(this.photoThumb(0), '1st Photo thumb')
    await t.hover(this.photoThumb(0)) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked

    for (let i = 0; i < numOfFiles; i++) {
      await isExistingAndVisibile(this.photoThumb(i), `${i + 1}th Photo thumb`)
      await t.click(this.photoCheckbox.nth(i))
    }
  }

  //@param { [string] } NameArray: files names to select
  async selectPhotosByName(NameArray) {
    console.log('Selecting ' + NameArray.length + ' picture(s)')
    await isExistingAndVisibile(
      this.photoThumbByName(NameArray[0]),
      `Photo thumb for ${NameArray[0]}`
    )
    await t.hover(this.photoThumbByName(NameArray[0])) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked

    for (let i = 0; i < NameArray.length; i++) {
      await isExistingAndVisibile(
        this.photoThumbByName(NameArray[i]),
        `Photo thumb for ${NameArray[i]}`
      )
      await t.click(this.photoThumbByNameCheckbox(NameArray[i]))
    }
  }
}
