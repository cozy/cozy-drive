import { t } from 'testcafe'
import { getPageUrl, isExistingAndVisible } from '../../helpers/utils'
import * as selectors from '../selectors'
import AlbumPage from '../photos-album/album-model'
import PhotoPage from '../photos/photos-model'
import logger from '../../helpers/logger'

const albumPage = new AlbumPage()

export default class AlbumsPage extends PhotoPage {
  async waitForLoading() {
    await t
      .expect(selectors.loading.exists)
      .notOk('Page didnt Load : selectors.loading still exists')
    await isExistingAndVisible('selectors.albumContentWrapper')
    logger.debug(`albums-model : waitForLoading Ok`)
  }

  // check that the albums view is empty
  async checkEmptyAlbum() {
    await this.waitForLoading()
    await isExistingAndVisible('selectors.folderEmpty')
    await isExistingAndVisible('selectors.albumEmptyText')
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
    await isExistingAndVisible('selectors.toolbarAlbumsList')
    await isExistingAndVisible('selectors.btnNewAlbum')
    await t.click(selectors.btnNewAlbum)
    //Check new album page :
    await t.expect(getPageUrl()).contains('albums/new')
    await isExistingAndVisible('selectors.inputAlbumName')
    await t
      .expect(selectors.inputAlbumName.value)
      .eql('Untitled album')
      .expect(selectors.inputAlbumName.focused)
      .ok('selectors.inputAlbumName.value is not focus')

    const allPhotosAlbumCount = await albumPage.getPhotosToAddCount(
      'On create Album page'
    )
    await t.expect(allPhotosAlbumCount).eql(t.ctx.totalFilesCount) //all photos are displayed
    await isExistingAndVisible('selectors.btnValidateAlbum')

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
    await isExistingAndVisible(
      `selectors.album(${albumName})`,
      selectors.album(albumName)
    )
    await t.click(selectors.album(albumName))
  }

  // @param {String} AlbumName : Name of the album
  // @param { number } photoNumber : Number of photos expected in the album (
  async isAlbumExistsAndVisible(albumName, photoNumber) {
    await isExistingAndVisible(
      `selectors.album(${albumName})`,
      selectors.album(albumName)
    )
    await t
      .expect(selectors.album(albumName).innerText)
      .contains(`${photoNumber} photo`)
  }
}
