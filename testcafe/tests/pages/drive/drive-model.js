import { t } from 'testcafe'
import logger from '../../helpers/logger'
import { isExistingAndVisibile } from '../../helpers/utils'
import * as selectors from '../selectors'

export default class DrivePage {
  //wait for content placeholder to disapered and contenttable to appear
  //@param {bool} isfull : set to true only if folder is known to have files
  //@param {bool} isNotAvailable set to true when checking removed public link
  async waitForLoading({ isNotAvailable, isFull } = {}) {
    await t
      .expect(selectors.contentPlaceHolder.exists)
      .notOk('selectors.contentPlaceHolder still displayed')
    if (!isNotAvailable) {
      await isExistingAndVisibile(
        selectors.contentTable,
        'selectors.contentTable'
      )
      if (isFull) {
        await isExistingAndVisibile(
          selectors.folderOrFileName,
          'selectors.folderOrFileName'
        )
      }
    }
    logger.debug('Loading Ok')
  }

  //@param {string} when : text for logger.debug
  async getContentRowCount(when) {
    //Count only 'real' content row, not the headers
    const contentRowsCount = await selectors.contentRows.count

    logger.debug(
      `Number of Content row(s) on page (${when} test):  ${contentRowsCount}`
    )
    return contentRowsCount
  }

  //return breadcrumb text
  async getbreadcrumb() {
    await isExistingAndVisibile(selectors.breadcrumb, 'selectors.breadcrumb')
    const childElCount = await selectors.breadcrumb.childElementCount
    let breadcrumbTitle = await selectors.breadcrumb.child(0).innerText
    if (childElCount > 1) {
      for (let i = 1; i < childElCount; i++) {
        if (await selectors.breadcrumb.child(i).exists) {
          breadcrumbTitle = `${breadcrumbTitle} > ${await selectors.breadcrumb.child(
            i
          ).innerText}`
        }
      }
    }
    breadcrumbTitle = breadcrumbTitle.replace(/(\r\n|\n|\r)/gm, '') //!FIXME remove EOL  https://trello.com/c/lYUkc8jV/1667-drive-breadcrumb-n-sur-mac-chrome-only
    return breadcrumbTitle
  }

  //Go back to base folder by clicking on 1s span in breadcrumb
  async goToBaseFolder(inModal = false) {
    let breadcrumb
    inModal
      ? (breadcrumb = selectors.modalBreadcrumb)
      : (breadcrumb = selectors.breadcrumb)
    await isExistingAndVisibile(
      breadcrumb.child(0),
      inModal
        ? `selectors.modalBreadcrumb.child(0)`
        : `selectors.breadcrumb.child(0)`
    )
    await t.click(breadcrumb.child(0))
    await this.waitForLoading()
    logger.info(`Navigation to base folder OK!`)
  }

  //@param {String} folderName
  async goToFolder(folderName, inModal = false) {
    let breadcrumbStart
    let folderOrFileName
    inModal
      ? (folderOrFileName = selectors.modalFolderOrFileName)
      : (folderOrFileName = selectors.folderOrFileName)

    if (!t.fixtureCtx.isVR) breadcrumbStart = await this.getbreadcrumb()
    await t
      .expect(folderOrFileName.withText(folderName).exists)
      .ok(`No folder named ${folderName}`)
      .click(folderOrFileName.withText(folderName))

    await this.waitForLoading()

    if (!t.fixtureCtx.isVR) {
      const breadcrumbEnd = await this.getbreadcrumb()
      await t.expect(breadcrumbEnd).eql(`${breadcrumbStart} > ${folderName}`)
    }
    logger.info(`Navigation into ${folderName} OK!`)
  }

  //@param { Array } filesIndexArray : Array of files index
  async selectElements(filesIndexArray) {
    logger.debug(`Selecting ${filesIndexArray.length} elements`)

    await isExistingAndVisibile(
      selectors.contentRows.nth(filesIndexArray[0]),
      `selectors.contentRows.nth(${filesIndexArray[0]})`
    )
    await t.hover(selectors.contentRows.nth(filesIndexArray[0])) //Only one 'hover' as all checkbox should be visible once the 1st checkbox is checked
    for (let i = 0; i < filesIndexArray.length; i++) {
      await isExistingAndVisibile(
        selectors.contentRows.nth(filesIndexArray[i]),
        `selectors.contentRows.nth(${filesIndexArray[i]})`
      )
      await isExistingAndVisibile(
        selectors.checboxFolderByRowIndex(filesIndexArray[i]),
        `selectors.checboxFolderByRowIndex(${filesIndexArray[i]})`
      )
      await t.click(selectors.checboxFolderByRowIndex(filesIndexArray[i]))
    }
    await isExistingAndVisibile(
      selectors.cozySelectionbar,
      'selectors.cozySelectionbar'
    )
  }

  //@param {string} fileName : file name
  async getElementIndex(fileName) {
    const paragraph = selectors.folderOrFileName
      .parent(`[class*="fil-content-row"]:not([class*="fil-content-row-head"])`)
      .withText(fileName)

    const index = await paragraph.prevSibling().count
    return index
  }
}
