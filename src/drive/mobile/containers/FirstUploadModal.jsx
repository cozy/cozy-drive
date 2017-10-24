import React, { Component } from 'react'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'
import { connect } from 'react-redux'
import withPersistentState from '../lib/withPersistentState'
import styles from '../styles/uploadprogression'
import { isIos } from '../lib/device'

const MINIMUM_LONG_UPLOAD_FILES_COUNT = 50

const FirstUploadModal = translate()(({ t, onClose }) => (
  <Modal title={t('mobile.first_sync.title')} withCross={false}>
    <ModalContent>
      <h4>{t('mobile.first_sync.tips')}</h4>
      <ul>
        <li>{t('mobile.first_sync.tip_wifi')}</li>
        <li>{t('mobile.first_sync.tip_bed')}</li>
        {isIos() && <li>{t('mobile.first_sync.tip_lock')}</li>}
      </ul>
      <p>{t('mobile.first_sync.result')}</p>
      <button onClick={onClose} className={styles['btn--full-width']}>
        {t('mobile.first_sync.button')}
      </button>
    </ModalContent>
  </Modal>
))

const showOnceOnUpload = WrappedComponent => {
  return class extends Component {
    state = {
      viewed: false
    }

    markAsViewed = () => {
      this.setState({ viewed: true })
    }

    render() {
      const { uploading } = this.props
      const { viewed } = this.state

      if (uploading && !viewed)
        return <WrappedComponent {...this.props} onClose={this.markAsViewed} />
      else return null
    }
  }
}

const OnlyOnceFirstUploadModal = withPersistentState(
  showOnceOnUpload(FirstUploadModal),
  'OnlyOnceFirstUploadModal'
)

const mapStateToProps = state => {
  const {
    uploading = false,
    currentUpload = { messageData: { total_upload: 0 } }
  } = state.mobile.mediaBackup
  const { messageData } = currentUpload
  return {
    uploading:
      uploading &&
      messageData['total_upload'] >= MINIMUM_LONG_UPLOAD_FILES_COUNT
  }
}

const ConnectedFirstUploadModal = connect(mapStateToProps)(
  OnlyOnceFirstUploadModal
)

export default ConnectedFirstUploadModal
