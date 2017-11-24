import React, { Component } from 'react'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'
import { connect } from 'react-redux'
import withPersistentState from '../lib/withPersistentState'
import styles from '../styles/uploadstatus'
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
    constructor(props) {
      super(props)
      this.restored = false
      this.state = {
        viewed: false
      }
    }

    componentStateRestored() {
      this.restored = true
      // As this method is called after the persisted state has been restored, we must trigger an update
      // by making a dumb setState call
      this.setState(prevState => prevState)
    }

    markAsViewed = () => {
      this.setState({ viewed: true })
    }

    render() {
      // we don't want to render unless the state is restored to avoid flashing
      if (!this.restored) {
        return null
      }
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
    currentUpload = { messageData: { total: 0 } }
  } = state.mobile.mediaBackup
  const { messageData } = currentUpload
  return {
    uploading:
      uploading && messageData['total'] >= MINIMUM_LONG_UPLOAD_FILES_COUNT
  }
}

const ConnectedFirstUploadModal = connect(mapStateToProps)(
  OnlyOnceFirstUploadModal
)

export default ConnectedFirstUploadModal
