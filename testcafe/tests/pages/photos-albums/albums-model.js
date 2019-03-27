import { t } from 'testcafe'
import {
  getPageUrl,
  getElementWithTestId,
  isExistingAndVisibile
} from '../../helpers/utils'
import AlbumPage from '../photos-album/album-model'
import PhotoPage from '../photos/photos-model'

const albumPage = new AlbumPage()

export default class AlbumsPage extends PhotoPage {
  constructor() {
    super()
    this.albumEmptyText = this.folderEmpty.withText(
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
  }

  async waitForLoading() {
    await t.expect(this.loading.exists).notOk('Page still loading')
    await isExistingAndVisibile(this.albumContentWrapper, 'Content Wrapper')
  }

  // check that the albums view is empty
  async checkEmptyAlbum() {
    await this.waitForLoading()
    await isExistingAndVisibile(this.folderEmpty, 'Empty Album')
    await isExistingAndVisibile(
      this.albumEmptyText,
      "Text: You don't have any album yet"
    )
  }

  // @param {String} albumName : Name for the new album
  // @param { number } photoNumber : Number of photos to add to the new album (it will add the first X photos from the timeline)
  // click on new album button, check the new album page, give a name to album and select photos
  async addNewAlbum(albumName, photoNumber) {
    await this.waitForLoading()
    await isExistingAndVisibile(this.toolbarAlbumsList, 'toolbar (album list)')
    await isExistingAndVisibile(this.btnNewAlbum, 'New album button')
    await t.click(this.btnNewAlbum)
    //Check new album page :
    await t.expect(getPageUrl()).contains('albums/new')
    await isExistingAndVisibile(albumPage.inputAlbumName, 'Input album Name')
    await t
      .expect(albumPage.inputAlbumName.value)
      .eql('Untitled album')
      .expect(albumPage.inputAlbumName.focused)
      .ok('Input album Name is not focus')

    const allPhotosAlbumCount = await albumPage.getPhotosToAddCount(
      'On create Album page'
    )
    await t.expect(allPhotosAlbumCount).eql(t.ctx.allPhotosStartCount) //all photos are displayed
    await isExistingAndVisibile(
      albumPage.btnValidateAlbum,
      'Create Album Button'
    )

    await t.typeText(albumPage.inputAlbumName, albumName)
    await albumPage.selectPhotostoAdd(0, photoNumber)
    await t.click(albumPage.btnValidateAlbum)
  }

  // @param {String} AlbumName : Name of the album
  async goToAlbum(albumName) {
    await isExistingAndVisibile(this.album(albumName), albumName)
    await t.click(this.album(albumName))
  }

  // @param {String} AlbumName : Name of the album
  // @param { number } photoNumber : Number of photos expected in the album (
  async isAlbumExistsAndVisible(albumName, photoNumber) {
    await isExistingAndVisibile(this.album(albumName), albumName)
    await t
      .expect(this.album(albumName).innerText)
      .contains(`${photoNumber} photo`)
  }
}
