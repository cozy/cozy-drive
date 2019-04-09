import { Selector, t } from 'testcafe'
import {
  getElementWithTestId,
  isExistingAndVisibile,
  getPageUrl,
  goBack
} from '../../helpers/utils'
import DrivePage from './drive-model'

export default class PublicDrivePage extends DrivePage {
  constructor() {
    super()
    //Logo
    this.logo = Selector('.coz-nav-apps-btns-home')

    // Folder view Only
    this.toolbarFolderPublic = getElementWithTestId('fil-toolbar-files-public')
    this.btnPublicCreateCozyFolder = this.toolbarFolderPublic
      .find('[class*="c-btn"]')
      .nth(0)
    this.btnPublicMoreMenuFolder = Selector('[class*="fil-toolbar-menu"]').find(
      '[class*="dri-btn--more"]'
    )

    // File view Only
    this.toolbarFilesPublic = Selector('[class*="toolbar-inside-bar"]')
    this.btnPublicCreateCozyFile = this.toolbarFilesPublic
      .find('[class*="c-btn"]')
      .nth(0)
    this.btnPublicMoreMenuFile = Selector(
      '[class*="fil-toolbar-menu--public"]'
    ).find('[class*="dri-btn--more"]')

    // Both File and Folder view
    this.btnPublicDownload = getElementWithTestId('fil-public-download')
    this.innerPublicMoreMenu = Selector('[class*="c-menu__inner--opened"]')
    this.btnPublicMobileCreateCozy = this.innerPublicMoreMenu
      .find('[class*="c-menu__item"]')
      .nth(1)
    this.btnPublicMobileDownload = this.innerPublicMoreMenu
      .find('[class*="c-menu__item"]')
      .nth(2)

    //error (not shared)
    this.errorAvailable = Selector('[class*="c-empty"]')
      .child('h2')
      .withText('Sorry, this link is no longer available.') // !FIXME: do not use text
  }
  // @param {string} type : 'file' or 'folder' : the toolbar is different depending on share type
  async checkActionMenuPublicDesktop(type) {
    const isFile = type === 'file' ? true : false
    await t //Mobile elements don't exist
      .expect(this.btnPublicMoreMenuFile.exists)
      .notOk('[...] Menu exists')
      .expect(this.btnPublicMoreMenuFolder.exists)
      .notOk('[...] Menu exists')
      .expect(this.innerPublicMoreMenu.exists)
      .notOk('Inner More Menu exists')
      .expect(this.innerPublicMoreMenu.exists)
      .notOk('Inner More Menu exists')
      .expect(this.btnPublicMobileCreateCozy.exists)
      .notOk('Create my Cozy Button (mobile) exists')
      .expect(this.btnPublicMobileDownload.exists)
      .notOk('Create my Cozy Button (mobile) exists')
    await isExistingAndVisibile(this.logo, 'Logo')
    await isExistingAndVisibile(
      isFile ? this.toolbarFilesPublic : this.toolbarFolderPublic,
      'toolbarFiles'
    )
    await isExistingAndVisibile(
      isFile ? this.btnPublicCreateCozyFile : this.btnPublicCreateCozyFolder,
      'Create my Cozy Button'
    )
    await isExistingAndVisibile(this.btnPublicDownload, 'Download FolderButton')
  }

  // @param {string} type : 'file' or 'folder' : the toolbar is different depending on share type
  async checkActionMenuPublicMobile(type) {
    const isFile = type === 'file' ? true : false
    await t
      .expect(this.btnPublicDownload.exists)
      .notOk('Download Button (desktop) exists')
      //On File Sharing, logo still exist on mobile, but is not visible (no problem on folder)
      .expect(isFile ? this.logo.visible : this.logo.exists)
      .notOk('Logo exists/visible')
      .expect(
        (isFile ? this.toolbarFilesPublic : this.toolbarFolderPublic).exists
      )
      .notOk('toolbar_file exists')
      .expect(this.btnPublicCreateCozyFile.exists)
      .notOk('Create Cozy button (desktop) exists')

    await isExistingAndVisibile(
      isFile ? this.btnPublicMoreMenuFile : this.btnPublicMoreMenuFolder,
      '[...] Button'
    )
    await t.click(
      isFile ? this.btnPublicMoreMenuFile : this.btnPublicMoreMenuFolder
    )
    await isExistingAndVisibile(this.innerPublicMoreMenu, 'Innner More Menu')
    await isExistingAndVisibile(
      this.btnPublicMobileDownload,
      'Download Button (mobile)'
    )
    await isExistingAndVisibile(
      this.btnPublicMobileCreateCozy,
      'Create my Cozy Button (mobile)'
    )
  }

  async checkCreateCozy() {
    await t
      .expect(getPageUrl())
      .eql(
        'https://manager.cozycloud.cc/cozy/create?pk_campaign=sharing-drive&pk_kwd=cozy'
      )

    await goBack()
  }

  async checkNotAvailable() {
    await isExistingAndVisibile(this.errorAvailable, 'Not available message')
  }
}
