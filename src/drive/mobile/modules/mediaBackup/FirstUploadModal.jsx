import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isIOSApp } from 'cozy-device-helper'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import Typography from 'cozy-ui/transpiled/react/Typography'

import withPersistentState from 'drive/mobile/lib/withPersistentState'

const MINIMUM_LONG_UPLOAD_FILES_COUNT = 50

const FirstUploadModal = translate()(({ t, onClose }) => (
  <ConfirmDialog
    open
    onClose={onClose}
    title={t('mobile.first_sync.title')}
    content={
      <>
        <Typography variant="h6">{t('mobile.first_sync.tips')}</Typography>
        <Typography variant="body1" paragraph>
          <ul>
            <li>{t('mobile.first_sync.tip_wifi')}</li>
            <li>{t('mobile.first_sync.tip_bed')}</li>
            {isIOSApp() && <li>{t('mobile.first_sync.tip_lock')}</li>}
          </ul>
        </Typography>
        <Typography variant="body1" paragraph>
          {t('mobile.first_sync.result')}
        </Typography>
      </>
    }
    actions={
      <Button
        onClick={onClose}
        extension="full"
        label={t('mobile.first_sync.button')}
      />
    }
  />
))

const showOnceOnUpload = WrappedComponent => {
  return class showOnceOnUploadClass extends Component {
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
  const { uploading = false, currentUpload = { messageData: { total: 0 } } } =
    state.mobile.mediaBackup
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
