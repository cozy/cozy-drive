import { Selector, t } from 'testcafe'
import {
  getElementWithTestId,
  isExistingAndVisibile,
  getPageUrl,
  goBack,
  getResponseStatusCode
} from '../helpers/utils'

import fs from 'fs'
import homedir from 'homedir'

export default class PublicDrivePage {
  constructor() {
    //loading
    this.contentPlaceHolder = Selector(
      '[class*="fil-content-file-placeholder"]'
    )

    //Logo
    this.logo = Selector('.coz-nav-apps-btns-home')

    //Toolbar - Action Menu
    this.toolbarFilesPublic = getElementWithTestId('fil-toolbar-files-public')
    this.btnPublicCreateCozy = this.toolbarFilesPublic
      .find('[class*="c-btn"]')
      .nth(0)
    this.btnPublicDownload = this.toolbarFilesPublic.find(
      '[class*="fil-public-download"]'
    )
    this.btnPublicMoreMenu = Selector('[class*="fil-toolbar-menu"]').find(
      '[class*="dri-btn--more"]'
    )
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
    //loading
  }

  async waitForLoading() {
    await t
      .expect(this.contentPlaceHolder.exists)
      .notOk('Content placeholder still displayed')
    console.log('Loading Ok')
  }

  async checkActionMenuPublicDesktop() {
    await t //Mobile elements don't exist
      .expect(this.btnPublicMoreMenu.exists)
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
    await isExistingAndVisibile(this.toolbarFilesPublic, 'toolbarFiles')
    await isExistingAndVisibile(this.btnPublicDownload, 'Download FolderButton')
    await isExistingAndVisibile(
      this.btnPublicCreateCozy,
      'Create my Cozy Button'
    )
  }

  async checkActionMenuPublicMobile() {
    await t //Desktop element don't exists
      .expect(this.logo.exists)
      .notOk('Logo exists')
      .expect(this.toolbarFilesPublic.exists)
      .notOk('toolbar_file exists')
      .expect(this.btnPublicDownload.exists)
      .notOk('Download Button (desktop) exists')
      .expect(this.btnPublicCreateCozy.exists)
      .notOk('Create Cozy button (desktop) exists')

    await isExistingAndVisibile(this.btnPublicMoreMenu, '[...] Button')
    await t.click(this.btnPublicMoreMenu)
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
      .eql('https://manager.cozycloud.cc/cozy/create?pk_campaign=sharing-drive')

    await goBack()
    await this.waitForLoading()
  }

  //@param{string} filename : Expected filename
  async checkLocalFile(filename) {
    const filepath = `${homedir()}/Downloads/${filename}`
    await t
      .expect(fs.existsSync(filepath))
      .ok(`Downloaded ${filename} doesn't exist`)
    console.log(`${filename} is downloaded`)
  }

  async deleteLocalFile(filename) {
    const filePath = `${homedir()}/Downloads/${filename}`
    fs.unlink(filePath, function(err) {
      if (err) throw err
      // if no error, file has been deleted successfully
      console.log(`${filename} deleted`)
    })
  }
  async checkNotAvailable() {
    await isExistingAndVisibile(this.errorAvailable)
  }
}
