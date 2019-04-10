import { t, Selector } from 'testcafe'
import {
  getPageUrl,
  getElementWithTestId,
  isExistingAndVisibile,
  checkAllImagesExists,
  overwriteCopyCommand,
  getLastExecutedCommand
} from '../../helpers/utils'
import PhotoPage from '../photos/photos-model'

export default class Page extends PhotoPage {
  constructor() {
    super()
    this.albumContentWrapper = getElementWithTestId('album-pho-content-wrapper')
    this.albumTitle = getElementWithTestId('pho-content-title')

    //New albums & edit album
    this.inputAlbumName = getElementWithTestId('input-album-name')
    this.pickerAlbumName = getElementWithTestId('pho-picker-album-name')
    this.btnValidateAlbum = getElementWithTestId('validate-album') //Seme button for create album and Add to album
    this.photoThumb = value => {
      return Selector('div')
        .withAttribute('data-test-item')
        .nth(value)
    }
    this.photoSectionAddToAlbum = getElementWithTestId('picker-panel')
      .find('div')
      .withAttribute('data-test-id', 'photo-section')

    this.allPhotosAddToAlbum = this.photoSectionAddToAlbum
      .find('img')
      .parent('div')
      .withAttribute('data-test-item')
    this.photoToAddCheckbox = this.photoSectionAddToAlbum.find(
      '[class*="pho-photo-select"][data-input="checkbox"]'
    )

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

    //those buttons are defined in cozy-ui (SelectionBar), so we cannot add data-test-id on them
    this.barPhotoBtnDeleteOrRemove = this.barPhoto.find('button').nth(2) //DELETE OR REMOVE FROM ALBUM

    //Sharing
    this.btnShare = this.toolbarAlbum
      .child('button')
      .withAttribute('data-test-id', 'share-button')
    this.divShareByLink = getElementWithTestId('share-by-link')
    this.toggleShareLink = this.divShareByLink.child('[class*="toggle"]')
    this.spanLinkCreating = Selector('[class*="share-bylink-header-creating"]')
    this.copyBtnShareByLink = Selector('button').withAttribute('data-test-url')
  }

  async waitForLoading() {
    await t.expect(this.loading.exists).notOk('Page still loading')
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

  // @param {Number} indexStart : which photo is the 1st selected
  // @param {Number} numOfFiles : Number of photo to add (X photos from timeline)
  async selectPhotostoAdd(indexStart, numOfFiles) {
    console.log(`Selecting ${numOfFiles} picture(s) from index ${indexStart}`)
    for (let i = indexStart; i < indexStart + numOfFiles; i++) {
      await isExistingAndVisibile(this.photoThumb(i), `${i + 1}th Photo thumb`)
      await t.click(this.photoToAddCheckbox.nth(i))
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
      await isExistingAndVisibile(this.folderEmpty, 'Folder Empty')
    } else {
      const allPhotosAlbumCount = await this.getPhotosCount('On Album page')
      await t.expect(allPhotosAlbumCount).eql(photoNumber) //all expected photos are displayed
    }
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

  // @param { number } photoNumber : Number of photos to remove from the album (
  async removePhoto(photoNumber) {
    const photoAlbumStart = await this.getPhotosCount('In album, before')
    await this.selectPhotos(photoNumber)
    await isExistingAndVisibile(this.barPhoto, 'Selection bar')

    console.log('Removing ' + photoNumber + ' picture(s)')
    await isExistingAndVisibile(this.barPhotoBtnDeleteOrRemove, 'Delete Button')
    await t.click(this.barPhotoBtnDeleteOrRemove)

    await isExistingAndVisibile(this.modalAlert, 'modal Alert')
    await t
      .expect(this.modalAlert.innerText)
      .contains('The photo has been removed from album') //!FIXME

    const photoAlbumEnd = await this.getPhotosCount('In album, before')
    await t.expect(photoAlbumEnd).eql(photoAlbumStart - photoNumber)
  }

  async deleteAlbum() {
    await isExistingAndVisibile(this.toolbarAlbum, 'Toolabr Album')
    await isExistingAndVisibile(this.moreMenuAlbum, '[...] Button')
    await t.click(this.moreMenuAlbum)
    await isExistingAndVisibile(this.moreMenuDeleteAlbum, 'Delete Button')
    await t.click(this.moreMenuDeleteAlbum)

    await isExistingAndVisibile(this.modalFooter, 'Modal delete')
    await isExistingAndVisibile(
      this.modalSecondButton,
      'Modal delete button Delete'
    )
    await t.click(this.modalSecondButton)
  }

  async shareAlbumPublicLink() {
    await isExistingAndVisibile(this.toolbarAlbum, 'toolbarAlbum')
    await isExistingAndVisibile(this.btnShare, `Share button`)
    await t.click(this.btnShare)
    await isExistingAndVisibile(this.divShareByLink, 'div Share by Link')
    await isExistingAndVisibile(this.toggleShareLink, 'Toggle Share by Link')
    await t
      .click(this.toggleShareLink)
      .expect(this.toggleShareLink.find('input').checked)
      .ok('toggle Link is unchecked')
      .expect(this.spanLinkCreating.exist)
      .notOk('Still creating Link')
    await isExistingAndVisibile(this.copyBtnShareByLink, 'Copy Link')

    await overwriteCopyCommand()

    await t
      .click(this.copyBtnShareByLink)
      .expect(getLastExecutedCommand())
      .eql('copy') //check link copy actually happens

    await isExistingAndVisibile(this.alertWrapper, '"successfull" modal alert')
  }

  async unshareAlbumPublicLink() {
    await isExistingAndVisibile(this.toolbarAlbum, 'toolbarAlbum')
    await isExistingAndVisibile(this.btnShare, `Share button`)
    await t.click(this.btnShare)
    await isExistingAndVisibile(this.divShareByLink, 'div Share by Link')
    await isExistingAndVisibile(this.toggleShareLink, 'Toggle Share by Link')
    await t
      .click(this.toggleShareLink)
      .expect(this.toggleShareLink.find('input').checked)
      .notOk('Toggle Link is checked')
      .expect(this.copyBtnShareByLink.exists)
      .notOk('Copy Link button still exists')
      .pressKey('esc')

    await isExistingAndVisibile(this.btnShare, `Share button`)
  }
}
