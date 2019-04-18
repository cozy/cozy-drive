import { t } from 'testcafe'
import { getPageUrl, isExistingAndVisibile } from '../../helpers/utils'
import * as selectors from '../selectors'
import AlbumPage from '../photos-album/album-model'
import PhotoPage from '../photos/photos-model'

const albumPage = new AlbumPage()

export default class AlbumsPage extends PhotoPage {
  async waitForLoading() {
    await t.expect(selectors.loading.exists).notOk('Page still loading')
    await isExistingAndVisibile(
      selectors.albumContentWrapper,
      'Content Wrapper'
    )
  }

  // check that the albums view is empty
  async checkEmptyAlbum() {
    await this.waitForLoading()
    await isExistingAndVisibile(selectors.folderEmpty, 'Empty Album')
    await isExistingAndVisibile(
      selectors.albumEmptyText,
      "Text: You don't have any album yet"
    )
  }

  // @param {String} albumName : Name for the new album
  // @param { number } photoNumber : Number of photos to add to the new album (it will add the first X photos from the timeline)
  // click on new album button, check the new album page, give a name to album and select photos
  async addNewAlbum({
    albumName: albumName,
    photoNumber: photoNumber,
    screenshotPath: screenshotPath,
    withMask = false
  }) {
    await this.waitForLoading()
    await isExistingAndVisibile(
      selectors.toolbarAlbumsList,
      'toolbar (album list)'
    )
    await isExistingAndVisibile(selectors.btnNewAlbum, 'New album button')
    await t.click(selectors.btnNewAlbum)
    //Check new album page :
    await t.expect(getPageUrl()).contains('albums/new')
    await isExistingAndVisibile(selectors.inputAlbumName, 'Input album Name')
    await t
      .expect(selectors.inputAlbumName.value)
      .eql('Untitled album')
      .expect(selectors.inputAlbumName.focused)
      .ok('Input album Name is not focus')

    const allPhotosAlbumCount = await albumPage.getPhotosToAddCount(
      'On create Album page'
    )
    await t.expect(allPhotosAlbumCount).eql(t.ctx.totalFilesCount) //all photos are displayed
    await isExistingAndVisibile(
      selectors.btnValidateAlbum,
      'Create Album Button'
    )

    await t.typeText(selectors.inputAlbumName, albumName)
    await albumPage.selectPhotostoAdd(0, photoNumber)

    if (t.fixtureCtx.isVR && screenshotPath)
      //dates show up here, so there is a mask for screenshots
      await t.fixtureCtx.vr.takeScreenshotAndUpload({
        screenshotPath: screenshotPath,
        withMask: withMask
      })

    await t.click(selectors.btnValidateAlbum)
  }

  // @param {String} AlbumName : Name of the album
  async goToAlbum(albumName) {
    await isExistingAndVisibile(selectors.album(albumName), albumName)
    await t.click(selectors.album(albumName))
  }

  // @param {String} AlbumName : Name of the album
  // @param { number } photoNumber : Number of photos expected in the album (
  async isAlbumExistsAndVisible(albumName, photoNumber) {
    await isExistingAndVisibile(selectors.album(albumName), albumName)
    await t
      .expect(selectors.album(albumName).innerText)
      .contains(`${photoNumber} photo`)
  }
}
