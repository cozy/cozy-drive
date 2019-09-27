import React, { Component } from 'react'
import Modal, { ModalDescription } from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'
import DocumentType from './DocumentType'

class ScannerQualification extends Component {
  state = {
    qualification: ''
  }
  render() {
    const { onUpload, t, dismissAction } = this.props
    const { qualification } = this.state
    return (
      <Modal
        primaryText={t('Scan.save')}
        mobileFullscreen
        primaryAction={async () => await onUpload(qualification)}
        secondaryText={t('Scan.cancel')}
        secondaryAction={() => dismissAction()}
        dismissAction={() => dismissAction()}
        overflowHidden={true}
        title={t('Scan.save_doc')}
      >
        <ModalDescription className="u-flex-grow-1">
          <DocumentType
            onQualified={qualification => {
              this.setState({ qualification })
            }}
          />
        </ModalDescription>
      </Modal>
    )
  }
}

export default translate()(ScannerQualification)
