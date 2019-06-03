//!FIXME Change selector (ID or react)
import { t } from 'testcafe'
import logger from '../../helpers/logger'
import {
  getPageUrl,
  isExistingAndVisible,
  checkAllImagesExists
} from '../../helpers/utils'
import * as selectors from '../selectors'

export default class Page {
  async initPhotoCountZero() {
    logger.debug(`Number of pictures on page (Before test): 0`)
    t.ctx.totalFilesCount = 0
  }

  async initPhotosCount() {
    t.ctx.totalFilesCount = await this.getPhotosCount('Before')
  }

  async goToAlbums() {
    await isExistingAndVisible('selectors.sidebarPhotos')
    await isExistingAndVisible('selectors.btnNavToAlbum')
    await t
      .click(selectors.btnNavToAlbum)
      .expect(getPageUrl())
      .contains('albums')
  }

  //@param {string} when : text for logger.debug
  async getPhotosCount(when) {
    await checkAllImagesExists()
    await isExistingAndVisible('selectors.photoSection')
    await isExistingAndVisible('selectors.allPhotosWrapper')
    await isExistingAndVisible('selectors.allPhotos')
    const allPhotosCount = await selectors.allPhotos.count

    logger.debug(
      `Number of pictures on page (${when} test):  ${allPhotosCount}`
    )

    return allPhotosCount
  }

  //@param { number } numOfFiles : number of file to select
  async selectPhotos(numOfFiles) {
    logger.debug('Selecting ' + numOfFiles + ' picture(s)')
    await isExistingAndVisible(
      'selectors.photoThumb(0)',
      selectors.photoThumb(0)
    )
    await t.hover(selectors.photoThumb(0)) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked

    for (let i = 0; i < numOfFiles; i++) {
      await isExistingAndVisible(
        `selectors.photoThumb(${i})`,
        selectors.photoThumb(i)
      )
      await t.click(selectors.photoCheckbox.nth(i))
    }
  }

  //@param { [string] } NameArray: files names to select
  async selectPhotosByName(NameArray) {
    logger.debug('Selecting ' + NameArray.length + ' picture(s)')
    await isExistingAndVisible(
      `selectors.photoThumbByName(${NameArray[0]})`,
      selectors.photoThumbByName(NameArray[0])
    )
    await t.hover(selectors.photoThumbByName(NameArray[0])) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked

    for (let i = 0; i < NameArray.length; i++) {
      await isExistingAndVisible(
        `selectors.photoThumbByName(${NameArray[i]})`,
        selectors.photoThumbByName(NameArray[i])
      )
      await t.click(selectors.photoThumbByNameCheckbox(NameArray[i]))
    }
  }
}
