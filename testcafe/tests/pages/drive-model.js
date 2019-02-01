import { Selector, t, ClientFunction } from 'testcafe'
import {
  getElementWithTestId,
  getPageUrl,
  isExistingAndVisibile,
  getClipboardData,
  overwriteCopyCommand,
  getLastExecutedCommand
} from '../helpers/utils'

export default class DrivePage {
  constructor() {
    //Sidebar
    this.sidebar = getElementWithTestId('driveSidebar')
    this.btnNavToFolder = getElementWithTestId('navToFolder')
    this.btnNavToRecent = getElementWithTestId('navToRecent')
    this.btnNavToSharing = getElementWithTestId('navToSharing')
    this.btnNavToTrash = getElementWithTestId('navToTrash')
    this.breadcrumb = getElementWithTestId('path-title')
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
    //loading
    this.content_placeholder = Selector(
      '[class*="fil-content-file-placeholder"]'
    )
    this.alertWrapper = Selector('[class*="c-alert-wrapper"]')

    //Toolbar - Action Menu
    this.toolbar_files = getElementWithTestId('fil-toolbar-files')
    this.btnMoreMenu = this.toolbar_files.find('[class*="dri-btn--more"]')
    this.coz_menu_inner = getElementWithTestId('coz-menu-inner')
    this.btnAddFolder = getElementWithTestId('add-folder-link').parent(
      '[class*="coz-menu-item"]'
    )()
    this.btnRemoveFolder = getElementWithTestId('fil-action-delete')

    //Files list
    this.content_rows = Selector(
      `[class*="fil-content-row"]:not([class*="fil-content-row-head"])`
    )
    this.foldersNamesInputs = getElementWithTestId('name-input')
    this.foldersNames = getElementWithTestId('fil-file-filename-and-ext')
    this.checboxFolderByRowIndex = value => {
      return this.content_rows
        .nth(value)
        .child('[class*="fil-content-cell"]')
        .child('[data-input="checkbox"]')
    }

    // Upload
    this.btnUpload = getElementWithTestId('uploadButton')
    this.divUpload = getElementWithTestId('uploadQueue')
    this.divUploadSuccess = getElementWithTestId('uploadQueue-success')

    // Sharing
    this.btnShare = this.toolbar_files
      .child('button')
      .withAttribute('data-test-id', 'share-button')
    this.modalShare = Selector('[class*="share-modal-content"]')
    this.divShareByLink = getElementWithTestId('share-by-link')
    this.toggleShareLink = this.divShareByLink.child('[class*="toggle"]')
    this.spanLinkCreating = Selector('[class*="share-bylink-header-creating"]')
    this.copyBtnShareByLink = Selector('button').withAttribute('data-test-data')
    this.btnShareByMe = this.toolbar_files
      .child('button')
      .withAttribute('data-test-id', 'share-by-me-button')

    //Top Option bar & Confirmation Modal
    this.cozySelectionbar = Selector('[class*="coz-selectionbar"]')
    this.cozySelectionbarBtnDelete = this.cozySelectionbar
      .find('button')
      .withText('REMOVE') //!FIX ME : do not use text! Do not use .nth(x) because the buttons count changes if one or several files/folders are selected
    this.modalDelete = Selector('[class*="c-modal"]').find('div')
    this.modalDeleteBtnDelete = this.modalDelete.find('button').nth(2) //REMOVE
  }

  async waitForLoading() {
    await t
      .expect(this.content_placeholder.exists)
      .notOk('Content placeholder still displayed')
  }

  //@param {string} when : text for console.log
  async getContentRowCount(when) {
    //Count only 'real' content row, not the headers
    const content_rows_count = await this.content_rows.count

    console.log(
      `Number of Content row(s) on page (${when} test):  ${content_rows_count}`
    )
    return content_rows_count
  }

  //@param {Selector}  btn : button to tests
  //@param {text} path : redirection path
  //@param {text} title : text for console.log
  async isSidebarButton(btn, path, title) {
    isExistingAndVisibile(btn, `Button ${title}`)
    await t.expect(btn.getAttribute('href')).eql(path)
  }

  //@param {Selector}  btn : button to tests
  //@param {text} path : redirection path
  //@param {text} title : Button title
  async clickOnSidebarButton(btn, path, title) {
    await t
      .click(btn)
      .expect(getPageUrl())
      .contains(path)

    await t.expect(await this.getbreadcrumb()).contains(title)

    await t.expect(this.errorEmpty.exists).notOk('Error shows up')
    await t.expect(this.errorOops.exists).notOk('Error shows up')
    console.log(`Navigation using Button ${title} OK!`)
  }

  async getbreadcrumb() {
    isExistingAndVisibile(this.breadcrumb, 'breadcrumb')
    const childElCount = await this.breadcrumb.childElementCount
    let breadcrumbTitle = await this.breadcrumb.child(0).innerText
    if (childElCount > 0) {
      for (let i = 1; i < childElCount; i++) {
        breadcrumbTitle = `${breadcrumbTitle} > ${await this.breadcrumb.child(i)
          .innerText}`
      }
    }
    return breadcrumbTitle
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

  async openActionMenu() {
    isExistingAndVisibile(this.toolbar_files, 'toolbar_files')
    isExistingAndVisibile(this.btnMoreMenu, `[...] button`)
    await t.click(this.btnMoreMenu)
    isExistingAndVisibile(this.coz_menu_inner, 'Cozy inner menu')
  }
  //@param {String} newFolderName
  async addNewFolder(newFolderName) {
    const breadcrumbStart = await this.getbreadcrumb()
    const rowCountStart = await this.getContentRowCount('Before')

    await this.openActionMenu()
    isExistingAndVisibile(this.btnAddFolder, 'Add Folder button')
    await t.click(this.btnAddFolder)

    const rowCountEnd = await this.getContentRowCount('After')
    await t.expect(rowCountEnd).eql(rowCountStart + 1) //New content line appears

    isExistingAndVisibile(this.foldersNamesInputs, 'Folder Name input')
    await t
      .typeText(this.foldersNamesInputs, newFolderName)
      .pressKey('enter')
      .expect(this.foldersNamesInputs.exists)
      .notOk('Edition mode still on') //No folder in edition mode -> No input on page
      .expect(this.foldersNames.withText(newFolderName).exists)
      .ok(`No folder named ${newFolderName}`)

    const breadcrumbEnd = await this.getbreadcrumb()
    await t.expect(breadcrumbEnd).eql(breadcrumbStart)
  }

  //@param {String} folderName
  async goToFolder(folderName) {
    const breadcrumbStart = await this.getbreadcrumb()
    await t
      .expect(this.foldersNames.withText(folderName).exists)
      .ok(`No folder named ${folderName}`)
      .click(this.foldersNames.withText(folderName))

    await this.waitForLoading()

    const breadcrumbEnd = await this.getbreadcrumb()
    await t.expect(breadcrumbEnd).eql(`${breadcrumbStart} > ${folderName}`)

    console.log(`Navigation into ${breadcrumbEnd} OK!`)
  }

  //@param {String Array} files: path to files to upload.
  async uploadFiles(files) {
    const numOfFiles = files.length
    const rowCountStart = await this.getContentRowCount('Before')

    console.log('Uploading ' + numOfFiles + ' file(s)')

    isExistingAndVisibile(this.btnUpload)
    await t.setFilesToUpload(this.btnUpload, files)

    isExistingAndVisibile(this.divUpload, 'Upload pop-in')
    isExistingAndVisibile(this.divUploadSuccess, 'successfull Upload pop-in')
    isExistingAndVisibile(this.alertWrapper, '"successfull" modal alert')
    await t
      .expect(this.divUpload.child('h4').innerText)
      .match(
        new RegExp('([' + numOfFiles + '].*){2}'),
        'Numbers of pictures uploaded does not match'
      )
    await t.takeScreenshot()
    const rowCountEnd = await this.getContentRowCount('After')
    await t.expect(rowCountEnd).eql(rowCountStart + 1) //New content line appears
  }

  //NOT FINISH !!!
  async shareFolderPublicLink() {
    isExistingAndVisibile(this.toolbar_files, 'toolbar_files')
    isExistingAndVisibile(this.btnShare, `Share button`)
    await t.click(this.btnShare)
    isExistingAndVisibile(this.ShareModal, 'Share modal')
    isExistingAndVisibile(this.divShareByLink, 'div Share by Link')
    isExistingAndVisibile(this.toggleShareLink, 'Toggle Share by Link')
    await t
      .click(this.toggleShareLink)
      .expect(this.toggleShareLink.find('input').checked)
      .ok('toggle Link is unchecked')
      .expect(this.spanLinkCreating.exist)
      .notOk('Still creating Link')
    isExistingAndVisibile(this.copyBtnShareByLink, 'Copy Link')

    await overwriteCopyCommand()

    await t
      .click(this.copyBtnShareByLink)
      .expect(getLastExecutedCommand())
      .eql('copy') //check link copy actually happens

    isExistingAndVisibile(this.alertWrapper, '"successfull" modal alert')
  }

  async unshareFolderPublicLink() {
    isExistingAndVisibile(this.toolbar_files, 'toolbar_files')
    isExistingAndVisibile(this.btnShareByMe, `Share by Me button`)
    await t.click(this.btnShareByMe)
    isExistingAndVisibile(this.ShareModal, 'Share modal')
    isExistingAndVisibile(this.divShareByLink, 'div Share by Link')
    isExistingAndVisibile(this.toggleShareLink, 'Toggle Share by Link')
    await t
      .click(this.toggleShareLink)
      .expect(this.toggleShareLink.find('input').checked)
      .notOk('Toggle Link is checked')
      .expect(this.copyBtnShareByLink.exists)
      .notOk('Copy Link button still exists')
      .pressKey('esc')
      .expect(this.btnShareByMe.exists)
      .notOk('Share by Me still exists')

    isExistingAndVisibile(this.btnShare, `Share button`)
  }

  //@param { Array } filesIndexArray : Array of files index
  async selectElements(filesIndexArray) {
    console.log(`Selecting ${filesIndexArray.length} elements`)

    isExistingAndVisibile(
      this.content_rows.nth(filesIndexArray[0]),
      `element with index ${filesIndexArray[0]}`
    )
    await t.hover(this.content_rows.nth(filesIndexArray[0])) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked
    for (let i = 0; i < filesIndexArray.length; i++) {
      isExistingAndVisibile(
        this.content_rows.nth(filesIndexArray[i]),
        `element with index ${filesIndexArray[i]}`
      )
      isExistingAndVisibile(
        this.checboxFolderByRowIndex(filesIndexArray[i]),
        `checkbox for element with index ${filesIndexArray[i]}`
      )
      await t.click(this.checboxFolderByRowIndex(filesIndexArray[i]))
    }
    isExistingAndVisibile(this.cozySelectionbar, 'Cozy Selection Bar')
  }

  //@param { Array } filesIndexArray : Array of files index
  async deleteElementsByIndex(filesIndexArray) {
    const rowCountStart = await this.getContentRowCount('Before')
    await this.selectElements(filesIndexArray)

    await t
      .click(this.cozySelectionbarBtnDelete)
      .expect(this.modalDelete.visible)
      .ok('Delete button does not show up')
      .click(this.modalDeleteBtnDelete)
    await t.takeScreenshot()
    const rowCountEnd = await this.getContentRowCount('After')
    await t.expect(rowCountEnd).eql(rowCountStart - filesIndexArray.length)
  }

  //@param {string} fileName : file name to delete
  //this function could be improve to use an Array of filename, if needed
  async deleteElementByName(fileName) {
    const paragraph = this.foldersNames
      .parent(`[class*="fil-content-row"]:not([class*="fil-content-row-head"])`)
      .addCustomDOMProperties({
        indexInRow: el => {
          const nodes = Array.prototype.slice.call(el.parentElement.children)

          return nodes.indexOf(el)
        }
      })

    const index = await paragraph.withText(fileName).indexInRow

    console.log(`index : ${index}`)
    await this.deleteElementsByIndex([index])
  }

  async deleteCurrentFolder() {
    const partialBreacrumbStart = await this.breadcrumb.child(0).innerText //We want only the 1st part of the breadcrumb to get the parent folder, so we cannot use getbreadcrumb()
    await this.openActionMenu()
    await t
      .click(this.btnRemoveFolder)
      .expect(this.modalDelete.visible)
      .ok('Delete button does not show up')
      .click(this.modalDeleteBtnDelete)
    isExistingAndVisibile(this.alertWrapper, '"successfull" modal alert')
    await t.takeScreenshot()

    await this.waitForLoading()

    const breadcrumbEnd = await this.getbreadcrumb()
    await t.expect(breadcrumbEnd).eql(partialBreacrumbStart)
  }
}
