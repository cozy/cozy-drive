import { t, Selector } from 'testcafe'
import {
  getPageUrl,
  getElementWithTestId,
  getElementWithTestItem,
  isExistingAndVisibile,
  checkAllImagesExists
} from '../helpers/utils'
import PhotoPage from '../pages/photos-model'
const photoPage = new PhotoPage()

export default class Page {
  constructor() {
    this.albumEmptyText = photoPage.folderEmpty.withText(
      "You don't have any album yet"
    ) //!FIXME : text !

    this.albumContentWrapper = getElementWithTestId('album-pho-content-wrapper')
    this.albumTitle = getElementWithTestId('pho-content-title')

    // Album list
    this.toolbarAlbumsList = getElementWithTestId('pho-toolbar-albums')
    this.btnNewAlbum = getElementWithTestId('album-add')
    this.album = albumName => {
      return getElementWithTestId('pho-album').withAttribute(
        'data-test-name',
        albumName
      )
    }

    //New albums & edit album
    this.inputAlbumName = getElementWithTestId('input-album-name')
    this.pickerAlbumName = getElementWithTestId('pho-picker-album-name')
    this.btnValidateAlbum = getElementWithTestId('validate-album') //Seme button for create album and Add to album
    this.photoThumb = value => {
      return getElementWithTestItem('pho-photo-item').nth(value)

      //  return Selector('[class*="pho-photo-item"]').nth(value)
    }
    this.photoSectionAddToAlbum = getElementWithTestId('picker-panel')
      .find('div')
      .withAttribute('data-test-id', 'photo-section')

    this.allPhotosAddToAlbum = this.photoSectionAddToAlbum
      .find('img')
      .parent('div')
      .withAttribute('data-test-item', 'pho-photo-item')
    this.photoCheckbox = this.photoSectionAddToAlbum.find(
      '[class*="pho-photo-select"][data-input="checkbox"]'
    )

    //Inside an album
    this.mainContent = Selector('[class*="pho-content"]')
    this.toolbarAlbum = getElementWithTestId('pho-toolbar-album')
    this.moreMenuAlbum = getElementWithTestId('more-btn-album')
    this.moreMenuDownloadAlbum = getElementWithTestId('menu-download-album')
    this.moreMenuRenameAlbum = getElementWithTestId('menu-rename-album')
    this.moreMenuAddPhotosToAlbum = getElementWithTestId(
      'menu-add-photos-to-album'
    )
    this.moreMenuDeleteAlbum = getElementWithTestId('menu-delete-album')
    this.modalAlert = Selector('[class*="c-alert-wrapper"]')
    this.btnBackToAlbum = getElementWithTestId('pho-content-album-previous')
  }

  async waitForLoading() {
    await t.expect(photoPage.loading.exists).notOk('Page still loading')
    await isExistingAndVisibile(this.albumContentWrapper, 'Content Wrapper')
  }

  //@param {string} when : text for console.log
  async getPhotosToAddCount(when) {
    await checkAllImagesExists()
    await isExistingAndVisibile(
      this.photoSectionAddToAlbum,
      'Photo section (add to album)'
    )
    await isExistingAndVisibile(this.allPhotosAddToAlbum, 'Photo item(s)')
    const allPhotosCount = await this.allPhotosAddToAlbum.count

    console.log(
      `Number of pictures ready to be added (${when} test):  ${allPhotosCount}`
    )
    return allPhotosCount
  }

  // check that the album is empty
  async checkEmptyAlbum() {
    await this.waitForLoading()
    await isExistingAndVisibile(photoPage.folderEmpty, 'Empty Album')
    await isExistingAndVisibile(
      this.albumEmptyText,
      "Text: You don't have any album yet"
    )
  }

  // @param {String} albumName : Name for the new album
  // @param { number } photoNumber : Number of photos to add to the new album (it will add the first X photos from the timeline)
  // click on new album button, check the new album page, give a name to album and select photos
  async addNewAlbum(albumName, photoNumber) {
    await isExistingAndVisibile(this.toolbarAlbumsList, 'toolbar (album list)')
    await isExistingAndVisibile(this.btnNewAlbum, 'New album button')
    await t.click(this.btnNewAlbum)
    //Check new album page :
    await t.expect(getPageUrl()).contains('albums/new')
    await isExistingAndVisibile(this.inputAlbumName, 'Input album Name')
    await t
      .expect(this.inputAlbumName.value)
      .eql('Untitled album')
      .expect(this.inputAlbumName.focused)
      .ok('Input album Name is not focus')

    const allPhotosAlbumCount = await this.getPhotosToAddCount(
      'On create Album page'
    )
    await t.expect(allPhotosAlbumCount).eql(t.ctx.allPhotosStartCount) //all photos are displayed
    await isExistingAndVisibile(this.btnValidateAlbum, 'Create Album Button')

    await t.typeText(this.inputAlbumName, albumName)
    await this.selectPhotostoAdd(0, photoNumber)
    await t.click(this.btnValidateAlbum)
  }

  // @param {Number} indexStart : which photo is the 1st selected
  // @param {Number} numOfFiles : Number of photo to add (X photos from timeline)
  async selectPhotostoAdd(indexStart, numOfFiles) {
    console.log(`Selecting ${numOfFiles} picture(s) from index ${indexStart}`)
    for (let i = indexStart; i < indexStart + numOfFiles; i++) {
      await isExistingAndVisibile(this.photoThumb(i), `${i + 1}th Photo thumb`)
      await t.click(this.photoCheckbox.nth(i))
    }
  }

  // @param {String} albumName : Name of the  album
  // @param { number } photoNumber : Number of photos expected in this album
  async checkAlbumPage(albumName, photoNumber) {
    await this.waitForLoading()
    await t
      .expect(getPageUrl())
      .contains('albums')
      .expect(getPageUrl())
      .notContains('new')
      .expect(this.albumTitle.innerText)
      .eql(albumName)

    if (photoNumber == 0) {
      await isExistingAndVisibile(photoPage.folderEmpty, 'Folder Empty')
    } else {
      const allPhotosAlbumCount = await photoPage.getPhotosCount(
        'On Album page'
      )
      await t.expect(allPhotosAlbumCount).eql(photoNumber) //all expected photos are displayed
    }
  }

  // @param {String} AlbumName : Name of the album
  async goToAlbum(albumName) {
    await isExistingAndVisibile(this.album(albumName), albumName)
    await t.click(this.album(albumName))
    await this.waitForLoading()
  }

  // @param {String} OldAlbumName : Name of the album (before renamming)
  // @param {String} NewAlbumName : New Name of the album (after renamming)
  // @param {string} exit : enter or click : Choose the exit method
  async renameAlbum(OldAlbumName, NewAlbumName, exitWithEnter) {
    await isExistingAndVisibile(this.albumTitle, 'Album Name')
    await t
      .expect(this.albumTitle.find('input').exists)
      .notOk('Title is already in input mode')
    await isExistingAndVisibile(this.toolbarAlbum, 'Toolabr Album')
    await isExistingAndVisibile(this.moreMenuAlbum, '[...] Button')
    await t.click(this.moreMenuAlbum)
    await isExistingAndVisibile(this.moreMenuRenameAlbum, 'Rename Button')
    await t.click(this.moreMenuRenameAlbum)
    await isExistingAndVisibile(
      this.albumTitle.find('input'),
      'Input Album Name'
    )
    await t
      .expect(this.albumTitle.find('input').value)
      .eql(OldAlbumName)
      .expect(this.albumTitle.find('input').focused)
      .ok('Input Name is not focus')
      .typeText(this.albumTitle.find('input'), NewAlbumName)
    //exit input
    exitWithEnter ? await t.pressKey('enter') : await t.click(this.mainContent)
  }

  // @param { number } count : Number of photos already in the album (needed to know which photo to add)
  // @param { number } photoNumber : Number of photos to add to the new album (
  // @param {String} AlbumName : Name of the album
  async addPhotosToAlbum(albumName, count, photoNumber) {
    await isExistingAndVisibile(this.toolbarAlbum, 'Toolabr Album')
    await isExistingAndVisibile(this.moreMenuAlbum, '[...] Button')
    await t.click(this.moreMenuAlbum)
    await isExistingAndVisibile(this.moreMenuAddPhotosToAlbum, 'Rename Button')
    await t.click(this.moreMenuAddPhotosToAlbum)

    await this.checkAddToAlbumPage(albumName)
    await this.selectPhotostoAdd(count, photoNumber)
    await t.click(this.btnValidateAlbum)

    await isExistingAndVisibile(this.modalAlert, 'modal Alert')
    const modalTxt = (await this.modalAlert.innerText).split(' ')
    await t.expect(modalTxt[modalTxt.length - 2]).eql(`${photoNumber}`)

    await this.checkAlbumPage(albumName, count + photoNumber)
  }

  // @param {String} AlbumName : Name of the album
  // @param {String} count : Number of photos already in the album (needed to count photos, as photos already in the album shows up twice)
  async checkAddToAlbumPage(albumName) {
    await t.expect(getPageUrl()).contains('edit')
    await isExistingAndVisibile(this.pickerAlbumName, 'Album Name')
    await t.expect(this.pickerAlbumName.innerText).eql(albumName)
    const photosToAddCount = await this.getPhotosToAddCount(
      'On Add to Album page'
    )
    await t.expect(photosToAddCount).eql(t.ctx.allPhotosStartCount) //all photos are displayed
    await isExistingAndVisibile(this.btnValidateAlbum, 'Add to Album Button')
  }

  async backToAlbumsList() {
    await isExistingAndVisibile(this.btnBackToAlbum, 'Back to albums List btn')
    await t.click(this.btnBackToAlbum)
    await this.waitForLoading()
  }

  // @param {String} AlbumName : Name of the album
  // @param { number } photoNumber : Number of photos expected in the album (
  async isAlbumExistsAndVisible(albumName, photoNumber) {
    await isExistingAndVisibile(this.album(albumName), albumName)
    await t
      .expect(this.album(albumName).innerText)
      .contains(`${photoNumber} photo`)
  }
  // @param { number } photoNumber : Number of photos to remove from the album (
  async removePhoto(photoNumber) {
    const photoAlbumStart = await photoPage.getPhotosCount('In album, before')
    await photoPage.selectPhotos(photoNumber)
    await isExistingAndVisibile(photoPage.barPhoto, 'Selection bar')

    console.log('Removing ' + photoNumber + ' picture(s)')
    await isExistingAndVisibile(
      photoPage.barPhotoBtnDeleteOrRemove,
      'Delete Button'
    )
    await t.click(photoPage.barPhotoBtnDeleteOrRemove)

    await isExistingAndVisibile(this.modalAlert, 'modal Alert')
    await t
      .expect(this.modalAlert.innerText)
      .contains('The photo has been removed from album') //!FIXME

    const photoAlbumEnd = await photoPage.getPhotosCount('In album, before')
    await t.expect(photoAlbumEnd).eql(photoAlbumStart - photoNumber)
  }

  async deleteAlbum() {
    await isExistingAndVisibile(this.toolbarAlbum, 'Toolabr Album')
    await isExistingAndVisibile(this.moreMenuAlbum, '[...] Button')
    await t.click(this.moreMenuAlbum)
    await isExistingAndVisibile(this.moreMenuDeleteAlbum, 'Delete Button')
    await t.click(this.moreMenuDeleteAlbum)

    await isExistingAndVisibile(photoPage.modalDelete, 'Modal delete')
    await isExistingAndVisibile(
      photoPage.modalDeleteBtnDelete,
      'Modal delete button Delete'
    )
    await t.click(photoPage.modalDeleteBtnDelete)
  }
}
