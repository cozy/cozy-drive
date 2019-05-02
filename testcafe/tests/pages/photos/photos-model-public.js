import { t } from 'testcafe'
import { getPageUrl, isExistingAndVisibile, goBack } from '../../helpers/utils'
import * as selectors from '../selectors'
import Photos from './photos-model'

export default class PublicPhotos extends Photos {
  async waitForLoading() {
    console.time('⏲ waitForLoading - photos model public')

    await t.expect(selectors.loading.exists).notOk('Page still loading')
    await isExistingAndVisibile(
      selectors.albumPublicLayout,
      'Album Public Layout'
    )
    console.timeEnd('⏲ waitForLoading - photos model public')
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

  async checkActionMenuAlbumPublicMobile() {
    await isExistingAndVisibile(selectors.btnMoreMenu, '[...] Menu')
    await t.click(selectors.btnMoreMenu)
    await isExistingAndVisibile(
      selectors.innerPublicMoreMenu,
      'inner [...] Menu'
    )
    await isExistingAndVisibile(
      selectors.btnAlbumPublicCreateCozyMobile,
      'Create my Cozy Button (Mobile)'
    )
    await isExistingAndVisibile(
      selectors.btnPublicDownloadPhotosMobile,
      'Mobile download button'
    )
    // Close [...] menu after check
    await t.click(selectors.btnMoreMenu)
  }

  async checkNotAvailable() {
    await isExistingAndVisibile(selectors.errorAvailable, 'Not available div')
    await t
      .expect(selectors.errorAvailable.innerText)
      .contains('Sorry, this link is no longer available.') //!FIXME
  }
}
