import { t } from 'testcafe'
import { getPageUrl, isExistingAndVisible, goBack } from '../../helpers/utils'
import * as selectors from '../selectors'
import Photos from './photos-model'
import logger from '../../helpers/logger'

export default class PublicPhotos extends Photos {
  async waitForLoading() {
    await t
      .expect(selectors.loading.exists)
      .notOk('Page didnt Load : selectors.loading still exists')
    await isExistingAndVisible('selectors.albumPublicLayout')
    logger.debug(`photos-model-public : waitForLoading Ok`)
  }

  async checkCreateCozy() {
    await t.expect(getPageUrl()).eql('https://manager.cozycloud.cc/cozy/create')
    await goBack()
    await this.waitForLoading()
  }

  async checkActionMenuAlbumPublicDesktop() {
    await isExistingAndVisible('selectors.logo')
    await isExistingAndVisible('selectors.toolbarAlbumPublic')
    await isExistingAndVisible(
      'selectors.btnAlbumPublicCreateCozyMobileDesktop'
    )
    await isExistingAndVisible('selectors.btnPublicDownloadPhotosDesktop')
  }

  async checkPhotosDownloadButtonOnMobile() {
    await isExistingAndVisible('selectors.btnMoreMenu')
    await t.click(selectors.btnMoreMenu, { speed: 0.5 })
    await isExistingAndVisible('selectors.innerPublicMoreMenu')
    await isExistingAndVisible('selectors.btnPublicDownloadPhotosMobile')
  }
  async checkPhotosCozyCreationButtonOnMobile() {
    await isExistingAndVisible('selectors.btnMoreMenu')
    await t.click(selectors.btnMoreMenu, { speed: 0.5 })
    await isExistingAndVisible('selectors.innerPublicMoreMenu')
    await isExistingAndVisible('selectors.btnAlbumPublicCreateCozyMobile')
  }

  async checkNotAvailable() {
    await isExistingAndVisible('selectors.errorAvailable')
    await t
      .expect(selectors.errorAvailable.innerText)
      .contains('Sorry, this link is no longer available.') // !FIXME
  }
}
