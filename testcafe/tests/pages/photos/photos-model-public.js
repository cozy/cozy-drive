import { t, Selector } from 'testcafe'
import {
  getPageUrl,
  getElementWithTestId,
  isExistingAndVisibile,
  goBack
} from '../../helpers/utils'
import Photos from './photos-model'

export default class PublicPhotos extends Photos {
  constructor() {
    super()
    this.logo = Selector('.coz-nav-apps-btns-home')

    this.albumPublicLayout = getElementWithTestId('pho-public-layout')
    this.toolbarPublicAlbum = getElementWithTestId('pho-toolbar-album-public')
    this.btnPublicCreateCozy = this.toolbarPublicAlbum.find(
      '[class*="pho-public-mycozy"]'
    )

    this.btnPublicDownload = getElementWithTestId('album-public-download')
    this.btnPublicDownloadMobile = getElementWithTestId(
      'album-public-download-mobile'
    )
    this.btnPublicCreacteCozyMobile = getElementWithTestId(
      'album-public-create-cozy-mobile'
    )

    this.btnMoreButton = getElementWithTestId('more-button').find('button')
    this.innerPublicMoreMenu = Selector('[class*="c-menu__inner--opened"]')
    this.btnPublicDownloadMobile = getElementWithTestId(
      'album-public-download-mobile'
    )

    //not available
    this.errorAvailable = getElementWithTestId('empty-share')
  }

  async waitForLoading() {
    await t.expect(this.loading.exists).notOk('Page still loading')
    await isExistingAndVisibile(this.albumPublicLayout, 'Album Public Layout')
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
    await isExistingAndVisibile(this.logo, 'Logo')
    await isExistingAndVisibile(this.toolbarPublicAlbum, 'toolbarPublicAlbum')
    await isExistingAndVisibile(
      this.btnPublicCreateCozy,
      'Create my Cozy Button'
    )
    await isExistingAndVisibile(this.btnPublicDownload, 'Download FolderButton')
  }

  async checkActionMenuAlbumPublicMobile() {
    await isExistingAndVisibile(this.btnMoreButton, '[...] Menu')
    await t.click(this.btnMoreButton)
    await isExistingAndVisibile(this.innerPublicMoreMenu, 'inner [...] Menu')
    await isExistingAndVisibile(
      this.btnPublicCreacteCozyMobile,
      'Create my Cozy Button (Mobile)'
    )
    await isExistingAndVisibile(
      this.btnPublicDownloadMobile,
      'Mobile download button'
    )
    // Close [...] menu after check
    await t.click(this.btnMoreButton)
  }

  async checkNotAvailable() {
    await isExistingAndVisibile(this.errorAvailable, 'Not available div')
    await t
      .expect(this.errorAvailable.innerText)
      .contains('Sorry, this link is no longer available.') //!FIXME
  }
}
