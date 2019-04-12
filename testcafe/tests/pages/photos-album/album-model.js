import { t } from 'testcafe'
import {
  getPageUrl,
  isExistingAndVisibile,
  checkAllImagesExists,
  overwriteCopyCommand,
  getLastExecutedCommand
} from '../../helpers/utils'
import * as selectors from '../selectors'
import PhotoPage from '../photos/photos-model'

export default class Page extends PhotoPage {
  async waitForLoading() {
    await t.expect(selectors.loading.exists).notOk('Page still loading')
    await isExistingAndVisibile(
      selectors.albumContentWrapper,
      'Content Wrapper'
    )
  }

  //@param {string} when : text for console.log
  async getPhotosToAddCount(when) {
    await checkAllImagesExists()
    await isExistingAndVisibile(
      selectors.photoSectionAddToAlbum,
      'Photo section (add to album)'
    )
    await isExistingAndVisibile(selectors.allPhotosAddToAlbum, 'Photo item(s)')
    const allPhotosCount = await selectors.allPhotosAddToAlbum.count

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
      await isExistingAndVisibile(
        selectors.photoThumb(i),
        `${i + 1}th Photo thumb`
      )
      await t.click(selectors.photoToAddCheckbox.nth(i))
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
      .expect(selectors.albumTitle.innerText)
      .eql(albumName)

    if (photoNumber == 0) {
      await isExistingAndVisibile(selectors.folderEmpty, 'Folder Empty')
    } else {
      const allPhotosAlbumCount = await this.getPhotosCount('On Album page')
      await t.expect(allPhotosAlbumCount).eql(photoNumber) //all expected photos are displayed
    }
  }

  // @param {String} OldAlbumName : Name of the album (before renamming)
  // @param {String} NewAlbumName : New Name of the album (after renamming)
  // @param {string} exit : enter or click : Choose the exit method
  async renameAlbum(OldAlbumName, NewAlbumName, exitWithEnter) {
    await isExistingAndVisibile(selectors.albumTitle, 'Album Name')
    await t
      .expect(selectors.albumTitle.find('input').exists)
      .notOk('Title is already in input mode')
    await isExistingAndVisibile(selectors.toolbarAlbum, 'Toolabr Album')
    await isExistingAndVisibile(selectors.btnMoreMenu, '[...] Button')
    await t.click(selectors.btnMoreMenu)
    await isExistingAndVisibile(selectors.moreMenuRenameAlbum, 'Rename Button')
    await t.click(selectors.moreMenuRenameAlbum)
    await isExistingAndVisibile(
      selectors.albumTitle.find('input'),
      'Input Album Name'
    )
    await t
      .expect(selectors.albumTitle.find('input').value)
      .eql(OldAlbumName)
      .expect(selectors.albumTitle.find('input').focused)
      .ok('Input Name is not focus')
      .typeText(selectors.albumTitle.find('input'), NewAlbumName)
    //exit input
    exitWithEnter
      ? await t.pressKey('enter')
      : await t.click(selectors.mainContent)
  }

  // @param { number } count : Number of photos already in the album (needed to know which photo to add)
  // @param { number } photoNumber : Number of photos to add to the new album (
  // @param {String} AlbumName : Name of the album
  async addPhotosToAlbum(albumName, count, photoNumber) {
    await isExistingAndVisibile(selectors.toolbarAlbum, 'Toolabr Album')
    await isExistingAndVisibile(selectors.btnMoreMenu, '[...] Button')
    await t.click(selectors.btnMoreMenu)
    await isExistingAndVisibile(
      selectors.moreMenuAddPhotosToAlbum,
      'Rename Button'
    )
    await t.click(selectors.moreMenuAddPhotosToAlbum)

    await this.checkAddToAlbumPage(albumName)
    await this.selectPhotostoAdd(count, photoNumber)
    await t.click(selectors.btnValidateAlbum)

    await isExistingAndVisibile(selectors.alertWrapper, 'modal Alert')
    const modalTxt = (await selectors.alertWrapper.innerText).split(' ')
    await t.expect(modalTxt[modalTxt.length - 2]).eql(`${photoNumber}`)

    await this.checkAlbumPage(albumName, count + photoNumber)
  }

  // @param {String} AlbumName : Name of the album
  // @param {String} count : Number of photos already in the album (needed to count photos, as photos already in the album shows up twice)
  async checkAddToAlbumPage(albumName) {
    await t.expect(getPageUrl()).contains('edit')
    await isExistingAndVisibile(selectors.pickerAlbumName, 'Album Name')
    await t.expect(selectors.pickerAlbumName.innerText).eql(albumName)
    const photosToAddCount = await this.getPhotosToAddCount(
      'On Add to Album page'
    )
    await t.expect(photosToAddCount).eql(t.ctx.allPhotosStartCount) //all photos are displayed
    await isExistingAndVisibile(
      selectors.btnValidateAlbum,
      'Add to Album Button'
    )
  }

  async backToAlbumsList() {
    await isExistingAndVisibile(
      selectors.btnBackToAlbum,
      'Back to albums List btn'
    )
    await t.click(selectors.btnBackToAlbum)
    await this.waitForLoading()
  }

  // @param { number } photoNumber : Number of photos to remove from the album (
  async removePhoto(photoNumber) {
    const photoAlbumStart = await this.getPhotosCount('In album, before')
    await this.selectPhotos(photoNumber)
    await isExistingAndVisibile(selectors.cozySelectionbar, 'Selection bar')

    console.log('Removing ' + photoNumber + ' picture(s)')
    await isExistingAndVisibile(
      selectors.btnRemoveFromAlbumCozySelectionBar,
      'Remove from album Button'
    )
    await t.click(selectors.btnRemoveFromAlbumCozySelectionBar)

    await isExistingAndVisibile(selectors.alertWrapper, 'modal Alert')
    await t
      .expect(selectors.alertWrapper.innerText)
      .contains('The photo has been removed from album') //!FIXME

    const photoAlbumEnd = await this.getPhotosCount('In album, before')
    await t.expect(photoAlbumEnd).eql(photoAlbumStart - photoNumber)
  }

  async deleteAlbum() {
    await isExistingAndVisibile(selectors.toolbarAlbum, 'Toolabr Album')
    await isExistingAndVisibile(selectors.btnMoreMenu, '[...] Button')
    await t.click(selectors.btnMoreMenu)
    await isExistingAndVisibile(selectors.moreMenuDeleteAlbum, 'Delete Button')
    await t.click(selectors.moreMenuDeleteAlbum)

    await isExistingAndVisibile(selectors.modalFooter, 'Modal delete')
    await isExistingAndVisibile(
      selectors.btnModalSecondButton,
      'Modal delete button Delete'
    )
    await t.click(selectors.btnModalSecondButton)
  }

  async shareAlbumPublicLink() {
    await isExistingAndVisibile(selectors.toolbarAlbum, 'toolbarAlbum')
    await isExistingAndVisibile(selectors.btnShareAlbum, `Share button`)
    await t.click(selectors.btnShareAlbum)
    await isExistingAndVisibile(selectors.divShareByLink, 'div Share by Link')
    await isExistingAndVisibile(
      selectors.toggleShareLink,
      'Toggle Share by Link'
    )
    await t
      .click(selectors.toggleShareLink)
      .expect(selectors.toggleShareLink.find('input').checked)
      .ok('toggle Link is unchecked')
      .expect(selectors.spanLinkCreating.exist)
      .notOk('Still creating Link')
    await isExistingAndVisibile(selectors.btnCopyShareByLink, 'Copy Link')

    await overwriteCopyCommand()

    await t
      .click(selectors.btnCopyShareByLink)
      .expect(getLastExecutedCommand())
      .eql('copy') //check link copy actually happens

    await isExistingAndVisibile(
      selectors.alertWrapper,
      '"successfull" modal alert'
    )
  }

  async unshareAlbumPublicLink() {
    await isExistingAndVisibile(selectors.toolbarAlbum, 'toolbarAlbum')
    await isExistingAndVisibile(selectors.btnShareAlbum, `Share button`)
    await t.click(selectors.btnShareAlbum)
    await isExistingAndVisibile(selectors.divShareByLink, 'div Share by Link')
    await isExistingAndVisibile(
      selectors.toggleShareLink,
      'Toggle Share by Link'
    )
    await t
      .click(selectors.toggleShareLink)
      .expect(selectors.toggleShareLink.find('input').checked)
      .notOk('Toggle Link is checked')
      .expect(selectors.btnCopyShareByLink.exists)
      .notOk('Copy Link button still exists')
      .pressKey('esc')

    await isExistingAndVisibile(selectors.btnShareAlbum, `Share button`)
  }
}
