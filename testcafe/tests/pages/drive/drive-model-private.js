import { t } from 'testcafe'
import {
  getElementWithTestId,
  getPageUrl,
  isExistingAndVisibile,
  overwriteCopyCommand,
  getLastExecutedCommand
} from '../../helpers/utils'
import { THUMBNAIL_DELAY } from '../../helpers/data'
import DrivePage from './drive-model'
import Modal from './drive-modal-model'
const moveMoadal = new Modal()

export default class privateDrivePage extends DrivePage {
  constructor() {
    super()

    this.elementActionMenuByRowIndex = value => {
      return this.content_rows
        .nth(value)
        .child('[class*="fil-content-file-action"]')
        .child('button')
    }
    this.actionMenuInner = getElementWithTestId('fil-actionmenu-inner')
    this.moveToButtonActionMenu = this.actionMenuInner.find(
      '[class*="fil-action-moveto"]'
    )
    this.restoreButtonActionMenu = this.actionMenuInner.find(
      '[class*="fil-action-restore"]'
    )
    this.removeButtonActionMenu = this.actionMenuInner.find(
      '[class*="fil-action-tras"]'
    )

    this.toolbarTrash = getElementWithTestId('empty-trash')
    this.buttonEmptyTrash = this.toolbarTrash.find('button')
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
    await this.waitForLoading()

    if (!t.fixtureCtx.isVR)
      await t.expect(await this.getbreadcrumb()).contains(title)

    await t.expect(this.errorEmpty.exists).notOk('Error shows up')
    await t.expect(this.errorOops.exists).notOk('Error shows up')
    console.log(`Navigation using Button ${title} OK!`)
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

  async takeScreenshotsForUpload(screenshotsPath, hasMask = false) {
    await t.fixtureCtx.vr.takeElementScreenshotAndUpload(
      this.divUpload,
      `${screenshotsPath}-Divupload`
    )
    //add wait to avoid thumbnail error on screenshots
    await t.wait(THUMBNAIL_DELAY)
    //relaod page to load thumbnails
    await t.eval(() => location.reload(true))
    await this.waitForLoading()

    await t.fixtureCtx.vr.takeScreenshotAndUpload(screenshotsPath, hasMask)
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
  async deleteElementsByIndex(filesIndexArray) {
    let rowCountStart
    if (!t.fixtureCtx.isVR) {
      rowCountStart = await this.getContentRowCount('Before')
    }
    await this.selectElements(filesIndexArray)

    await t
      .click(this.cozySelectionbarBtnDelete)
      .expect(this.modalFooter.visible)
      .ok('Delete button does not show up')
      .click(this.modalSecondButton)
    if (!t.fixtureCtx.isVR) {
      const rowCountEnd = await this.getContentRowCount('After')
      await t.expect(rowCountEnd).eql(rowCountStart - filesIndexArray.length)
    }
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
    await t.click(this.btnRemoveFolder)
    await isExistingAndVisibile(this.modalFooter, 'Modal delete')

    if (t.fixtureCtx.isVR)
      //dates show up here, so there is a mask for screenshots
      await t.fixtureCtx.vr.takeScreenshotAndUpload(screenshotPath, true)
    await t.click(this.modalSecondButton)
    await isExistingAndVisibile(this.alertWrapper, '"successfull" modal alert')

    await this.waitForLoading()
    if (!t.fixtureCtx.isVR) {
      const breadcrumbEnd = await this.getbreadcrumb()
      await t.expect(breadcrumbEnd).eql(partialBreacrumbStart)
    }
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param { integer } index : file/folder index
  //@param {String} newName : new name for file/folder
  //@param {bool} : exitWithEnter
  async renameElementsByIndex(index, newName, screenshotPath, exitWithEnter) {
    await this.selectElements([index])

    await t.click(this.cozySelectionbarBtnRename)
    await isExistingAndVisibile(this.foldersNamesInputs, 'Folder Name input')
    //dates shows up here, so there is a mask for screenshots
    await t.fixtureCtx.vr.takeScreenshotAndUpload(
      `${screenshotPath}-rename1`,
      true
    )

    await t.typeText(this.foldersNamesInputs, `${newName}`, { replace: true })
    exitWithEnter ? await t.pressKey('enter') : await t.click(this.contentTable)
    await t
      .expect(this.foldersNamesInputs.exists)
      .notOk('Edition mode still on') //No folder in edition mode -> No input on page
      .expect(this.folderOrFileName.withText(`${newName}`).exists)
      .ok(`No folder/file named ${newName}`)
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  //@param {string} elementName : file/folder name to rename
  //@param {string} newName : file/folder new name
  //@param {bool} : exitWithEnter
  async renameElementByName(
    elementName,
    newName,
    screenshotPath,
    exitWithEnter
  ) {
    const index = await this.getElementIndex(elementName)
    await this.renameElementsByIndex(
      index,
      newName,
      screenshotPath,
      exitWithEnter
    )
  }

  //@param { integer } index :  file index
  async clickOnActionMenuforFile(index) {
    await isExistingAndVisibile(
      this.content_rows.nth(index),
      `element with index ${index}`
    )

    await isExistingAndVisibile(
      this.elementActionMenuByRowIndex(index),
      `Menu [...] for element with index ${index}`
    )
    await t.click(this.elementActionMenuByRowIndex(index))

    await isExistingAndVisibile(
      this.actionMenuInner,
      'Element [...] Menu inner'
    )
  }

  //@param {string} fileName : file/folder on which to click on action menu
  async clickOnActionMenuforElementName(fileName) {
    const index = await this.getElementIndex(fileName)
    await this.clickOnActionMenuforFile(index)
  }

  //@param {string} fileName : file/folder to move
  async showMoveModalForElement(elementToMove) {
    await this.clickOnActionMenuforElementName(elementToMove)
    await t.click(this.moveToButtonActionMenu)
    await isExistingAndVisibile(moveMoadal.modalContent, 'Modal Content')
    await moveMoadal.waitForLoading()
  }

  //@param {String} screenshotPath : path for screenshots taken in this test
  async emptyTrash(screenshotPath) {
    await isExistingAndVisibile(this.toolbarTrash, 'toolbar Trash')
    await isExistingAndVisibile(this.buttonEmptyTrash, 'Empty trash button')
    await t.click(this.buttonEmptyTrash)
    await t.fixtureCtx.vr.takeScreenshotAndUpload(
      `${screenshotPath}-emptyTrash`,
      true
    )
    await t
      .expect(this.modalFooter.visible)
      .ok('Delete button does not show up')
      .click(this.modalSecondButton)
  }
}
