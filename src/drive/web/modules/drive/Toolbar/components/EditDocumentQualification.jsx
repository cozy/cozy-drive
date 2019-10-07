import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/react/I18n'
import { withClient } from 'cozy-client'
import NewModal from './NewModal'
import DocumentQualification from './DocumentQualification'
import { getItemById, getThemeByItem } from './DocumentTypeData'
import { getTracker } from 'cozy-ui/react/helpers/tracker'

const pushAnalytics = item => {
  const tracker = getTracker()
  if (tracker) {
    tracker.push(['trackEvent', 'Drive', 'Scanner', 'Edit Qualification'])
    if (item && item.label) {
      tracker.push(['trackEvent', 'Drive', 'Qualification', item.label])
    }
  }
}
/**
 * Display the Modal to Edit the category of the selected files
 */
class EditDocumentQualification extends Component {
  state = {
    qualification: undefined
  }
  render() {
    const { document, onClose, t, client } = this.props
    const { qualification } = this.state
    const item = document.metadata.id ? getItemById(document.metadata.id) : null
    const itemId = item ? item.id : null

    const theme = item ? getThemeByItem(item) : null
    const categoryLabel = item ? theme.label : null
    return (
      <NewModal
        title={t('Scan.qualify')}
        dismissAction={onClose}
        primaryText={t('Scan.apply')}
        primaryAction={async () => {
          /* const fileCollection = client.collection('io.cozy.files')
           const metadata = fileCollection.createFileMetadata(qualification)
          const test = await fileCollection.updateFileMetadata(document._id, {
            metadata: {
              hhh: 'nnn',
              extractor_version: '5'
            },
            name: 'toto3'
          }) */
          pushAnalytics(item)
          alert('SOON ')
          onClose()
        }}
        primaryType={'regular'}
        secondaryText={t('Scan.cancel')}
        secondaryAction={() => onClose()}
        secondaryType={'secondary'}
        description={
          <DocumentQualification
            onQualified={qualification => {
              this.setState({ qualification })
            }}
            initialSelected={{
              itemId,
              categoryLabel
            }}
          />
        }
      />
    )
  }
}
EditDocumentQualification.propTypes = {
  document: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  client: PropTypes.object
}
export default translate()(withClient(EditDocumentQualification))
