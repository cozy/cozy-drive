import { t } from 'testcafe'
import { getPageUrl, isExistingAndVisibile, goBack } from '../../helpers/utils'
import * as selectors from '../selectors'
import Photos from './photos-model'

export default class PublicPhotos extends Photos {
  async waitForLoading() {
    await t.expect(selectors.loading.exists).notOk('Page still loading')
    await isExistingAndVisibile(
      selectors.albumPublicLayout,
      'Album Public Layout'
    )
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
    await isExistingAndVisibile(selectors.logo, 'Logo')
    await isExistingAndVisibile(
      selectors.toolbarAlbumPublic,
      'toolbarAlbumPublic'
    )
    await isExistingAndVisibile(
      selectors.btnAlbumPublicCreateCozyMobileDesktop,
      'Create my Cozy Button'
    )
    await isExistingAndVisibile(
      selectors.btnPublicDownloadPhotosDesktop,
      'Download FolderButton'
    )
  }

  async checkPhotosDownloadButtonOnMobile() {
    await isExistingAndVisibile(selectors.btnMoreMenu, '[...] Button')
    await t.click(selectors.btnMoreMenu, { speed: 0.5 })
    await isExistingAndVisibile(
      selectors.innerPublicMoreMenu,
      'Innner More Menu'
    )
    await isExistingAndVisibile(
      selectors.btnPublicDownloadPhotosMobile,
      'Download Button (mobile)'
    )
  }
  async checkPhotosCozyCreationButtonOnMobile() {
    await isExistingAndVisibile(selectors.btnMoreMenu, '[...] Button')
    await t.click(selectors.btnMoreMenu, { speed: 0.5 })
    await isExistingAndVisibile(
      selectors.innerPublicMoreMenu,
      'Innner More Menu'
    )
    await isExistingAndVisibile(
      selectors.btnAlbumPublicCreateCozyMobile,
      'Create my Cozy Button (mobile)'
    )
  }

  async checkNotAvailable() {
    await isExistingAndVisibile(selectors.errorAvailable, 'Not available div')
    await t
      .expect(selectors.errorAvailable.innerText)
      .contains('Sorry, this link is no longer available.') //!FIXME
  }
}
