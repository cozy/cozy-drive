import {
  getElementWithTestId,
  isExistingAndVisibile
} from '../../helpers/utils'
import { t } from 'testcafe'
import DrivePage from './drive-model'

export default class MoveModal extends DrivePage {
  constructor() {
    super()

    //Overwrite some selector to use our regular drive method in modal context
    this.modaleContent = getElementWithTestId('fil-content-modal')

    this.breadcrumb = this.modal
      .find('h2')
      .withAttribute('data-test-id', 'path-title')
    this.folderOrFileName = this.modaleContent
      .find('div')
      .withAttribute('data-test-id', 'fil-file-filename-and-ext')
  }

  async moveElementTo(destinationFolder) {
    await this.goToBaseFolder()
    await this.goToFolder(destinationFolder)

    await isExistingAndVisibile(this.modalSecondButton, 'Move Button')

    await t.click(this.modalSecondButton)
  }
}
