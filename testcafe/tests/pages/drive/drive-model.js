import { Selector, t } from 'testcafe'
import {
  getElementWithTestId,
  isExistingAndVisibile,
  checkAllImagesExists
} from '../../helpers/utils'

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
    this.cozNavPopContent = Selector('[class*=coz-nav-pop-content]')
    this.btnCozBarDrive = this.cozNavPopContent
      .find('li.coz-nav-apps-item > a')
      .withText('Cozy Drive') // !FIXME: do not use text

    //Error and empty folders
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
    this.contentPlaceHolder = Selector(
      '[class*="fil-content-file-placeholder"]'
    )
    this.alertWrapper = Selector('[class*="c-alert-wrapper"]')

    //Toolbar - Action Menu
    this.toolbarFiles = getElementWithTestId('fil-toolbar-files')
    this.btnMoreMenu = this.toolbarFiles.find('[class*="dri-btn--more"]')
    this.cozyMenuInner = getElementWithTestId('coz-menu-inner')
    this.btnAddFolder = getElementWithTestId('add-folder-link').parent(
      '[class*="coz-menu-item"]'
    )()
    this.btnRemoveFolder = getElementWithTestId('fil-action-delete')

    //Files list
    this.contentTable = Selector('[class*="fil-content-table"]')
    this.content_rows = Selector(
      `[class*="fil-content-row"]:not([class*="fil-content-row-head"])`
    )
    this.foldersNamesInputs = getElementWithTestId('name-input')
    this.folderOrFileName = getElementWithTestId('fil-file-filename-and-ext')
    this.checboxFolderByRowIndex = value => {
      return this.content_rows
        .nth(value)
        .child('[class*="fil-content-cell"]')
        .child('[data-input="checkbox"]')
    }

    // Upload
    this.btnUpload = getElementWithTestId('upload-btn')
    this.divDragnDrop = this.contentTable.sibling('input[type="file"]')
    this.divUpload = getElementWithTestId('upload-queue')
    this.queue = Selector('[class*="upload-queue-list"]')

    this.divUploadSuccess = getElementWithTestId('upload-queue-success')
    this.uploadedItemName = value => {
      return getElementWithTestId('upload-queue-item-name').withText(value)
    }
    this.uploadedItem = value => {
      return this.uploadedItemName(value)
        .parent('div')
        .withAttribute('data-test-id', 'upload-queue-item')
    }

    // Sharing
    this.btnShare = this.toolbarFiles
      .child('button')
      .withAttribute('data-test-id', 'share-button')
    this.divShareByLink = getElementWithTestId('share-by-link')
    this.toggleShareLink = this.divShareByLink.child('[class*="toggle"]')
    this.spanLinkCreating = Selector('[class*="share-bylink-header-creating"]')
    this.copyBtnShareByLink = Selector('button').withAttribute('data-test-url')
    this.btnShareByMe = this.toolbarFiles
      .child('button')
      .withAttribute('data-test-id', 'share-by-me-button')

    this.shareBadgeForRowindex = value => {
      return this.content_rows.nth(value).find('[class*="shared-badge"]')
    }

    //Top Option bar & Confirmation Modal
    this.cozySelectionbar = Selector('[class*="coz-selectionbar"]')
    this.cozySelectionbarBtnDelete = this.cozySelectionbar
      .find('button')
      .withText('REMOVE') //!FIX ME : do not use text! Do not use .nth(x) because the buttons count changes if one or several files/folders are selected
    this.cozySelectionbarBtnShare = this.cozySelectionbar
      .find('button')
      .withText('SHARE') //!FIX ME : do not use text! Do not use .nth(x) because the buttons count changes if one or several files/folders are selected
    this.cozySelectionbarBtnRename = this.cozySelectionbar
      .find('button')
      .withText('RENAME') //!FIX ME : do not use text! Do not use .nth(x) because the buttons count changes if one or several files/folders are selected
    this.modal = Selector('[class*="c-modal"]')
    this.modalClose = this.modal.find('[class*="c-btn--close"]')
    this.modalFooter = this.modal.find('[class*="c-modal-footer"]')
    this.modalFirstButton = this.modalFooter.find('button').nth(0) //CANCEL
    this.modalSecondButton = this.modalFooter.find('button').nth(1) //REMOVE
  }

  //wait for content placeholder to disapered and contenttable to appear
  //@param {bool} isfull : set to true only if folder is known to have files
  //@param {bool} isNotAvailable set to true when checking removed public link
  async waitForLoading({ isNotAvailable, isFull } = {}) {
    await t
      .expect(this.contentPlaceHolder.exists)
      .notOk('Content placeholder still displayed')
    if (!isNotAvailable) {
      await isExistingAndVisibile(this.contentTable, 'content Table')
      if (isFull) {
        await isExistingAndVisibile(this.folderOrFileName, 'folder list')
      }
    }
    await checkAllImagesExists()
    console.log('Loading Ok')
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

  async getbreadcrumb() {
    await isExistingAndVisibile(this.breadcrumb, 'breadcrumb')
    const childElCount = await this.breadcrumb.childElementCount
    let breadcrumbTitle = await this.breadcrumb.child(0).innerText
    if (childElCount > 1) {
      for (let i = 1; i < childElCount; i++) {
        if (await this.breadcrumb.child(i).exists) {
          breadcrumbTitle = `${breadcrumbTitle} > ${await this.breadcrumb.child(
            i
          ).innerText}`
        }
      }
    }
    breadcrumbTitle = breadcrumbTitle.replace(/(\r\n|\n|\r)/gm, '') //!FIXME remove EOL  https://trello.com/c/lYUkc8jV/1667-drive-breadcrumb-n-sur-mac-chrome-only
    return breadcrumbTitle
  }

  //Go back to base folder by clicking on 1s span in breadcrumb
  async goToBaseFolder() {
    await isExistingAndVisibile(
      this.breadcrumb.child(0),
      'breadcrumb (base folder)'
    )
    await t.click(this.breadcrumb.child(0))
    await this.waitForLoading()
    console.log(`Navigation to base folder OK!`)
  }

  //@param {String} folderName
  async goToFolder(folderName) {
    let breadcrumbStart
    if (!t.fixtureCtx.isVR) breadcrumbStart = await this.getbreadcrumb()

    await t
      .expect(this.folderOrFileName.withText(folderName).exists)
      .ok(`No folder named ${folderName}`)
      .click(this.folderOrFileName.withText(folderName))

    await this.waitForLoading()

    if (!t.fixtureCtx.isVR) {
      const breadcrumbEnd = await this.getbreadcrumb()
      await t.expect(breadcrumbEnd).eql(`${breadcrumbStart} > ${folderName}`)
    }
    console.log(`Navigation into ${folderName} OK!`)
  }
  //@param { Array } filesIndexArray : Array of files index
  async selectElements(filesIndexArray) {
    console.log(`Selecting ${filesIndexArray.length} elements`)

    await isExistingAndVisibile(
      this.content_rows.nth(filesIndexArray[0]),
      `element with index ${filesIndexArray[0]}`
    )
    await t.hover(this.content_rows.nth(filesIndexArray[0])) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked
    for (let i = 0; i < filesIndexArray.length; i++) {
      await isExistingAndVisibile(
        this.content_rows.nth(filesIndexArray[i]),
        `element with index ${filesIndexArray[i]}`
      )
      await isExistingAndVisibile(
        this.checboxFolderByRowIndex(filesIndexArray[i]),
        `checkbox for element with index ${filesIndexArray[i]}`
      )
      await t.click(this.checboxFolderByRowIndex(filesIndexArray[i]))
    }
    await isExistingAndVisibile(this.cozySelectionbar, 'Cozy Selection Bar')
  }

  //@param {string} fileName : file name
  async getElementIndex(fileName) {
    const paragraph = this.folderOrFileName
      .parent(`[class*="fil-content-row"]:not([class*="fil-content-row-head"])`)
      .withText(fileName)

    const index = await paragraph.prevSibling().count
    return index
  }
}
