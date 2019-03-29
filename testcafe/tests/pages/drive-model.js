import { Selector, t } from 'testcafe'
import {
  getElementWithTestId,
  getPageUrl,
  isExistingAndVisibile,
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
    this.modalDelete = Selector('[class*="c-modal"]').find('div')
    this.modalDeleteBtnDelete = this.modalDelete.find('button').nth(2) //REMOVE
  }

  //wait for content placeholder to disapered and contenttable to appear
  async waitForLoading() {
    await t
      .expect(this.contentPlaceHolder.exists)
      .notOk('Content placeholder still displayed')
    await isExistingAndVisibile(this.contentTable, 'content Table')
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
    await isExistingAndVisibile(btn, `Button ${title}`)
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

  async openCozyBarMenu() {
    await isExistingAndVisibile(this.btnMainApp, 'Cozy bar - Main app button')
    await t.click(this.btnMainApp)
    await isExistingAndVisibile(this.cozNavPopContent, 'Cozy bar - App popup')
  }

  async checkMainMenu() {
    await isExistingAndVisibile(this.cozBar, 'Cozy bar')
    await this.openCozyBarMenu()
    await isExistingAndVisibile(this.btnCozBarDrive, 'Cozy bar - Drive button')

    await t
      .expect(this.btnCozBarDrive.withAttribute('href').exists)
      .notOk('There is a link on the button')
      .expect(
        this.btnCozBarDrive.parent('li').filter('[class*=current]').exists
      )
      .ok('Drive is not current app')
  }

  async openActionMenu() {
    await isExistingAndVisibile(this.toolbarFiles, 'toolbarFiles')
    await isExistingAndVisibile(this.btnMoreMenu, `[...] button`)
    await t.click(this.btnMoreMenu)
    await isExistingAndVisibile(this.cozyMenuInner, 'Cozy inner menu')
  }

  //@param {String} newFolderName
  async addNewFolder(newFolderName, screenshotPath) {
    let breadcrumbStart, rowCountStart
    if (!t.fixtureCtx.isVR) {
      breadcrumbStart = await this.getbreadcrumb()
      rowCountStart = await this.getContentRowCount('Before')
    }
    await this.openActionMenu()

    if (t.fixtureCtx.isVR)
      await t.fixtureCtx.vr.takeScreenshotAndUpload(screenshotPath)

    await isExistingAndVisibile(this.btnAddFolder, 'Add Folder button')
    await t.click(this.btnAddFolder)

    if (!t.fixtureCtx.isVR) {
      const rowCountEnd = await this.getContentRowCount('After')
      await t.expect(rowCountEnd).eql(rowCountStart + 1) //New content line appears
    }

    await isExistingAndVisibile(this.foldersNamesInputs, 'Folder Name input')
    await t
      .typeText(this.foldersNamesInputs, newFolderName)
      .pressKey('enter')
      .expect(this.foldersNamesInputs.exists)
      .notOk('Edition mode still on') //No folder in edition mode -> No input on page
      .expect(this.folderOrFileName.withText(newFolderName).exists)
      .ok(`No folder named ${newFolderName}`)

    if (!t.fixtureCtx.isVR) {
      const breadcrumbEnd = await this.getbreadcrumb()
      await t.expect(breadcrumbEnd).eql(breadcrumbStart)
    }
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

  //@param {String Array} files: path to files to upload.
  async uploadFiles(files) {
    const numOfFiles = files.length
    let rowCountStart
    if (!t.fixtureCtx.isVR)
      rowCountStart = await this.getContentRowCount('Before Upload')

    console.log(`Uploading ${numOfFiles} file(s)`)

    await isExistingAndVisibile(this.btnUpload, 'Upload Button')
    await t.setFilesToUpload(this.btnUpload, files)
    await isExistingAndVisibile(this.divUpload, 'Upload pop-in')

    console.group('Files uploaded : ')
    for (let i = 0; i < numOfFiles; i++) {
      const fileNameChunks = files[i].split('/')
      const fileName = fileNameChunks[fileNameChunks.length - 1]
      await isExistingAndVisibile(
        this.uploadedItem(fileName),
        `Item : ${fileName}`
      )
      await t
        //hasClass doesn't support [class*='upload-queue-item--done'], only full class name, so we cannot use it
        .expect(this.uploadedItem(fileName).getAttribute('class'))
        .contains('upload-queue-item--done')
    }
    console.groupEnd()

    if (!t.fixtureCtx.isVR) {
      // When uploading one file, check for the alert wrapper. When there are lots of files to upload, it already disappear once we finish checking each line
      if (numOfFiles == 1) {
        await isExistingAndVisibile(
          this.alertWrapper,
          '"successfull" modal alert'
        )
      }
      await isExistingAndVisibile(
        this.divUploadSuccess,
        'successfull Upload pop-in'
      )
      await t
        .expect(this.divUpload.child('h4').innerText)
        .match(
          new RegExp('([' + numOfFiles + '].*){2}'),
          'Numbers of files uploaded does not match'
        )

      const rowCountEnd = await this.getContentRowCount('After')
      await t.expect(rowCountEnd).eql(rowCountStart + numOfFiles) //New content line appears
    }
  }

  async shareFolderPublicLink() {
    await isExistingAndVisibile(this.toolbarFiles, 'toolbarFiles')
    await isExistingAndVisibile(this.btnShare, `Share button`)
    await t.click(this.btnShare)
    await isExistingAndVisibile(this.divShareByLink, 'div Share by Link')
    await isExistingAndVisibile(this.toggleShareLink, 'Toggle Share by Link')
    await t
      .click(this.toggleShareLink)
      .expect(this.toggleShareLink.find('input').checked)
      .ok('toggle Link is unchecked')
      .expect(this.spanLinkCreating.exist)
      .notOk('Still creating Link')
    await isExistingAndVisibile(this.copyBtnShareByLink, 'Copy Link')

    await overwriteCopyCommand()

    await t
      .click(this.copyBtnShareByLink)
      .expect(getLastExecutedCommand())
      .eql('copy') //check link copy actually happens

    await isExistingAndVisibile(this.alertWrapper, '"successfull" modal alert')
  }

  async unshareFolderPublicLink() {
    await isExistingAndVisibile(this.toolbarFiles, 'toolbarFiles')
    await isExistingAndVisibile(this.btnShareByMe, `Share by Me button`)
    await t.click(this.btnShareByMe)
    await isExistingAndVisibile(this.divShareByLink, 'div Share by Link')
    await isExistingAndVisibile(this.toggleShareLink, 'Toggle Share by Link')
    await t
      .click(this.toggleShareLink)
      .expect(this.toggleShareLink.find('input').checked)
      .notOk('Toggle Link is checked')
      .expect(this.copyBtnShareByLink.exists)
      .notOk('Copy Link button still exists')
      .pressKey('esc')
      .expect(this.btnShareByMe.exists)
      .notOk('Share by Me still exists')

    await isExistingAndVisibile(this.btnShare, `Share button`)
  }

  async shareFirstFilePublicLink() {
    await this.selectElements([0])

    await t.click(this.cozySelectionbarBtnShare)
    await isExistingAndVisibile(this.divShareByLink, 'div Share by Link')
    await isExistingAndVisibile(this.toggleShareLink, 'Toggle Share by Link')
    await t
      .click(this.toggleShareLink)
      .expect(this.toggleShareLink.find('input').checked)
      .ok('toggle Link is unchecked')
      .expect(this.spanLinkCreating.exist)
      .notOk('Still creating Link')
    await isExistingAndVisibile(this.copyBtnShareByLink, 'Copy Link')

    await overwriteCopyCommand()

    await t
      .click(this.copyBtnShareByLink)
      .expect(getLastExecutedCommand())
      .eql('copy') //check link copy actually happens

    await isExistingAndVisibile(this.alertWrapper, '"successfull" modal alert')
    await isExistingAndVisibile(this.shareBadgeForRowindex(0), 'Share badge')
  }

  async unshareFirstFilePublicLink() {
    await this.selectElements([0])
    await isExistingAndVisibile(this.shareBadgeForRowindex(0), 'Share badge')
    //check the bagge after selecting the 1st row, as `selectElements` already check await isExistingAndVisibile(1st row)

    await t.click(this.cozySelectionbarBtnShare)
    await isExistingAndVisibile(this.divShareByLink, 'div Share by Link')
    await isExistingAndVisibile(this.toggleShareLink, 'Toggle Share by Link')
    await t
      .click(this.toggleShareLink)
      .expect(this.toggleShareLink.find('input').checked)
      .notOk('Toggle Link is checked')
      .expect(this.copyBtnShareByLink.exists)
      .notOk('Copy Link button still exists')
      .pressKey('esc')
      .expect(this.shareBadgeForRowindex(0).exists)
      .notOk('Share badge still exists')
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
    const index = await this.getElementIndex(fileName)

    console.log(`index : ${index}`)
    await this.deleteElementsByIndex([index])
  }

  async deleteCurrentFolder(screenshotPath) {
    let partialBreacrumbStart
    if (!t.fixtureCtx.isVR) {
      partialBreacrumbStart = await this.breadcrumb.child(0).innerText //We want only the 1st part of the breadcrumb to get the parent folder, so we cannot use getbreadcrumb()
      partialBreacrumbStart = partialBreacrumbStart.replace(
        /(\r\n|\n|\r)/gm,
        ''
      ) //!FIXME  https://trello.com/c/lYUkc8jV/1667-drive-breadcrumb-n-sur-mac-chrome-only
    }
    await this.openActionMenu()
    await t
      .click(this.btnRemoveFolder)
      .expect(this.modalDelete.visible)
      .ok('Delete button does not show up')
    if (t.fixtureCtx.isVR)
      await t.fixtureCtx.vr.takeScreenshotAndUpload(screenshotPath)
    await t.click(this.modalDeleteBtnDelete)
    await isExistingAndVisibile(this.alertWrapper, '"successfull" modal alert')
    await t.takeScreenshot()

    await this.waitForLoading()
    if (!t.fixtureCtx.isVR) {
      const breadcrumbEnd = await this.getbreadcrumb()
      await t.expect(breadcrumbEnd).eql(partialBreacrumbStart)
    }
  }
}
