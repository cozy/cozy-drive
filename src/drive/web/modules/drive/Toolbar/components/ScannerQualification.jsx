import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/react/I18n'
import DocumentQualification from './DocumentQualification'

import NewModal from './NewModal'

import { getTracker } from 'cozy-ui/react/helpers/tracker'

const pushAnalytics = qualification => {
  const tracker = getTracker()
  if (tracker) {
    tracker.push(['trackEvent', 'Drive', 'Scanner', 'Add Qualification'])
    if (qualification && qualification.label) {
      tracker.push([
        'trackEvent',
        'Drive',
        'Qualification',
        qualification.label
      ])
    }
  }
}
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
    qualification: undefined,
    filename: ''
  }

  render() {
    const { onSave, t, dismissAction } = this.props
    const { qualification, filename } = this.state
    return (
      <NewModal
        title={t('Scan.save_doc')}
        dismissAction={dismissAction}
        primaryText={t('Scan.save')}
        primaryAction={async () => {
          pushAnalytics(qualification)
          await onSave(qualification, filename)
        }}
        primaryType={'regular'}
        secondaryText={t('Scan.cancel')}
        secondaryAction={() => dismissAction()}
        secondaryType={'secondary'}
        description={
          <DocumentQualification
            onQualified={(qualification, filename) => {
              this.setState({ qualification, filename })
            }}
            onFileNameChanged={filename => {
              this.setState({ filename })
            }}
            editFileName={true}
            title={t('Scan.doc_type')}
          />
        }
      />
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
