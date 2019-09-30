import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Modal, {
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalButtons
} from 'cozy-ui/react/Modal'
import { Button, Icon } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'
import DocumentQualification from './DocumentQualification'

import classNames from 'classnames'
import styles from './styles.styl'

/**
 * ScannerQualification component
 *
 * This component is used to be displayed just after taking a
 * photo on a mobile device from the Scanner feature.
 *
 * It displays a modal with the `Qualification` Process.
 * ATM the `Qualificiation` process is only about choosing the
 * right category for a document but soon we'll have rename and
 * one day OCR.
 */
class ScannerQualification extends Component {
  state = {
    qualification: ''
  }
  render() {
    const { onSave, t, dismissAction } = this.props
    const { qualification } = this.state
    //!TODO Move this new kind of Modal to UI
    return (
      <Modal mobileFullscreen closable={false}>
        <ModalHeader className={classNames(styles['modal-header'])}>
          <h2>{t('Scan.save_doc')}</h2>
          <Button
            icon={<Icon icon={'cross'} size={'16'} />}
            onClick={() => dismissAction()}
            iconOnly
            label={t('close')}
            subtle
            theme={'secondary'}
          />
        </ModalHeader>
        <ModalContent className="u-flex-grow-1 u-ph-1">
          <DocumentQualification
            onQualified={qualification => {
              this.setState({ qualification })
            }}
          />
        </ModalContent>
        <ModalFooter className={classNames(styles['modal-footer'])}>
          <ModalButtons
            primaryText={t('Scan.save')}
            primaryAction={async () => await onSave(qualification)}
            primaryType={'regular'}
            secondaryText={t('Scan.cancel')}
            secondaryAction={() => dismissAction()}
            secondaryType={'secondary'}
          />
        </ModalFooter>
      </Modal>
    )
  }
}

ScannerQualification.propTypes = {
  /**
   * primary action of the modal
   *
   */
  onSave: PropTypes.func.isRequired,
  dismissAction: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}
export default translate()(ScannerQualification)
