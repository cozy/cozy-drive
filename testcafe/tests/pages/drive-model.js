import { Selector, t } from 'testcafe'
import {
  getElementWithTestId,
  getPageUrl,
  isExistingAndVisibile
} from '../helpers/utils'

export default class Page {
  constructor() {
    //Sidebar
    this.sidebar = getElementWithTestId('driveSidebar')
    this.btnNavToFolder = getElementWithTestId('navToFolder')
    this.btnNavToRecent = getElementWithTestId('navToRecent')
    this.btnNavToSharing = getElementWithTestId('navToSharing')
    this.btnNavToTrash = getElementWithTestId('navToTrash')
    this.breadcrumbTitle = getElementWithTestId('path-title')
    //Main menu
    this.cozBar = Selector('#coz-bar')
    this.btnMainApp = this.cozBar.find('div.coz-nav-apps-btns > button')
    this.cozNavPopContent = Selector('[class*=coz-nav-pop]')
    this.btnCozBarDrive = this.cozNavPopContent
      .find('li.coz-nav-apps-item > a')
      .withText('Cozy Drive') // !FIXME: do not use text

    //Error and empty folders
    // !FIXME better selector for error

    //c-empty is use for empty drive, or error..
    this.driveEmpty = Selector('[class*="c-empty"]')
      .parent(0)
      .withAttribute('data-test-id', 'fil-content-body')

    //oops is a class for error only
    this.errorOops = Selector('[class*="oops"]')

    this.errorEmpty = Selector('[class*="c-empty"]')
      .child('h2')
      .withText('Switch online!') // !FIXME: do not use text

    //Toolbar
    this.toolbarFile = getElementWithTestId('fil-toolbar-files')
    this.btnMoreMenu = this.toolbarFile
      .find('button')
      .withAttribute('title', 'more')
    this.btnAddFolder = getElementWithTestId('add-folder-link').parent(
      'div.[class*="coz-menu-item"]'
    )
  }

  async isSidebarButton(btn, path, title) {
    isExistingAndVisibile(btn, `Button ${title}`)
    await t.expect(btn.getAttribute('href')).eql(path)
  }

  async clickOnSidebarButton(btn, path, title) {
    await t
      .click(btn)
      .expect(getPageUrl())
      .contains(path)

    isExistingAndVisibile(this.breadcrumbTitle, `Page title : ${title}`)
    await t.expect(this.breadcrumbTitle.child('span').innerText).contains(title)

    await t.expect(this.errorEmpty.exists).notOk('Error shows up')
    await t.expect(this.errorOops.exists).notOk('Error shows up')
    console.log(`Navigation using Button ${title} OK!`)
  }

  async openCozyBarMenu() {
    isExistingAndVisibile(this.btnMainApp, 'Cozy bar - Main app button')
    await t.click(this.btnMainApp)
    isExistingAndVisibile(this.cozNavPopContent, 'Cozy bar - App popup')
  }

  async checkMainMenu() {
    isExistingAndVisibile(this.cozBar, 'Cozy bar')
    await this.openCozyBarMenu()
    isExistingAndVisibile(this.btnCozBarDrive, 'Cozy bar - Drive button')

    await t
      .expect(this.btnCozBarDrive.withAttribute('href').exists)
      .notOk('There is a link on the button')
      .expect(
        this.btnCozBarDrive.parent('li').filter('[class*=current]').exists
      )
      .ok('Drive is not current app')
  }
}
