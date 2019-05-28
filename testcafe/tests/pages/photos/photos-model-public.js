import { t } from 'testcafe'
import { getPageUrl, isExistingAndVisibile, goBack } from '../../helpers/utils'
import * as selectors from '../selectors'
import Photos from './photos-model'
import logger from '../../helpers/logger'

export default class PublicPhotos extends Photos {
  async waitForLoading() {
    await t
      .expect(selectors.loading.exists)
      .notOk(
        'waitForLoading - Page didnt Load : selectors.loading still exists'
      )
    await isExistingAndVisibile(
      selectors.albumPublicLayout,
      'waitForLoading - selectors.albumPublicLayout'
    )
    logger.debug(`photos-model-public : waitForLoading Ok`)
  }

  async checkCreateCozy() {
    await t
      .expect(getPageUrl())
      .eql(
        'https://manager.cozycloud.cc/cozy/create?pk_campaign=sharing-photos&pk_kwd=cozy'
      )
    await goBack()
    await this.waitForLoading()
  }

  async checkActionMenuAlbumPublicDesktop() {
    await isExistingAndVisibile(selectors.logo, 'selectors.logo')
    await isExistingAndVisibile(
      selectors.toolbarAlbumPublic,
      '  selectors.toolbarAlbumPublic'
    )
    await isExistingAndVisibile(
      selectors.btnAlbumPublicCreateCozyMobileDesktop,
      'selectors.btnAlbumPublicCreateCozyMobileDesktop'
    )
    await isExistingAndVisibile(
      selectors.btnPublicDownloadPhotosDesktop,
      'selectors.btnPublicDownloadPhotosDesktop'
    )
  }

  async checkPhotosDownloadButtonOnMobile() {
    await isExistingAndVisibile(selectors.btnMoreMenu, 'selectors.btnMoreMenu')
    await t.click(selectors.btnMoreMenu, { speed: 0.5 })
    await isExistingAndVisibile(
      selectors.innerPublicMoreMenu,
      'selectors.innerPublicMoreMenu'
    )
    await isExistingAndVisibile(
      selectors.btnPublicDownloadPhotosMobile,
      'selectors.btnPublicDownloadPhotosMobile'
    )
  }
  async checkPhotosCozyCreationButtonOnMobile() {
    await isExistingAndVisibile(selectors.btnMoreMenu, 'selectors.btnMoreMenu')
    await t.click(selectors.btnMoreMenu, { speed: 0.5 })
    await isExistingAndVisibile(
      selectors.innerPublicMoreMenu,
      'selectors.innerPublicMoreMenu'
    )
    await isExistingAndVisibile(
      selectors.btnAlbumPublicCreateCozyMobile,
      'selectors.btnAlbumPublicCreateCozyMobile'
    )
  }

  async checkNotAvailable() {
    await isExistingAndVisibile(
      selectors.errorAvailable,
      'selectors.errorAvailable'
    )
    await t
      .expect(selectors.errorAvailable.innerText)
      .contains('Sorry, this link is no longer available.') //!FIXME
  }
}
