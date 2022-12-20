import { t } from 'testcafe'
import { isExistingAndVisible, getPageUrl, goBack } from '../../helpers/utils'
import * as selectors from '../selectors'
import DrivePage from './drive-model'

export default class PublicDrivePage extends DrivePage {
  // @param {string} type : 'file' or 'folder' : the toolbar is different depending on share type
  async checkActionMenuPublicDesktop(type) {
    const isFile = type === 'file' ? true : false
    await t // Mobile elements don't exist
      .expect(selectors.btnMoreMenu.exists)
      .notOk('selectors.btnMoreMenu exists')
      .expect(selectors.innerPublicMoreMenu.exists)
      .notOk('selectors.innerPublicMoreMenu exists')
    await isExistingAndVisible('selectors.logo')
    await isExistingAndVisible(
      isFile ? `selectors.toolbarViewerPublic` : `selectors.toolbarDrivePublic`
    )
    await isExistingAndVisible(
      isFile
        ? `selectors.btnViewerPublicCreateCozy`
        : `selectors.btnDrivePublicCreateCozy`
    )
    await isExistingAndVisible('selectors.btnPublicDownloadDrive')
  }

  // @param {string} type : 'file' or 'folder' : the toolbar is different depending on share type
  async checkDesktopElementsNotShowingOnMobile(type) {
    const isFile = type === 'file' ? true : false
    await t
      .expect(selectors.btnPublicDownloadDrive.exists)
      .notOk('selectors.btnPublicDownloadDrive exists')
      // On File Sharing, logo still exist on mobile, but is not visible (no problem on folder)
      .expect(isFile ? selectors.logo.visible : selectors.logo.exists)
      .notOk('selectors.logo exists/visible')
      .expect(
        (isFile ? selectors.toolbarViewerPublic : selectors.toolbarDrivePublic)
          .exists
      )
      .notOk('toolbar_file exists')
      .expect(selectors.btnViewerPublicCreateCozy.exists)
      .notOk('selectors.btnViewerPublicCreateCozy exists')
  }

  async checkCreateCozy() {
    await t.expect(getPageUrl()).eql('https://manager.cozycloud.cc/cozy/create')

    await goBack()
  }
  async checkDownloadButtonOnMobile() {
    await isExistingAndVisible('selectors.btnMoreMenu')
    await t.click(selectors.btnMoreMenu, { speed: 0.5 })
    await isExistingAndVisible('selectors.innerPublicMoreMenu')
    await isExistingAndVisible('selectors.btnPublicMobileDownload')
  }
  async checkCozyCreationButtonOnMobile() {
    await isExistingAndVisible('selectors.btnMoreMenu')
    await t.click(selectors.btnMoreMenu, { speed: 0.5 })
    await isExistingAndVisible('selectors.innerPublicMoreMenu')
    await isExistingAndVisible('selectors.btnPublicMobileCreateCozy')
  }

  async checkNotAvailable() {
    await isExistingAndVisible('selectors.errorAvailable')
  }
}
