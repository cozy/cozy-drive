import { connect } from 'react-redux'
import Settings from '../components/Settings'
import { setBackupImages } from '../actions/settings'
import { showUnlinkConfirmation, hideUnlinkConfirmation, unlink } from '../actions/unlink'
import { mediaBackup, startMediaUpload, endMediaUpload } from '../actions/mediaBackup'

const mapStateToProps = (state, ownProps) => ({
  mediaUploading: state.mobile.mediaBackup.uploading,
  version: window.navigator.appInfo ? window.navigator.appInfo.version : 'dev',
  serverUrl: state.mobile.settings.serverUrl,
  backupImages: state.mobile.settings.backupImages,
  displayUnlinkConfirmation: state.mobile.ui.displayUnlinkConfirmation,
  client: state.mobile.settings.client
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  launchBackup: (dir) => {
    dispatch(startMediaUpload())
    dispatch(mediaBackup(dir))
    .then(() => dispatch(endMediaUpload()))
    .catch(() => dispatch(endMediaUpload()))
  },
  showUnlinkConfirmation: () => dispatch(showUnlinkConfirmation()),
  hideUnlinkConfirmation: () => dispatch(hideUnlinkConfirmation()),
  unlink: (client) => {
    dispatch(unlink(client))
    ownProps.router.replace('/onboarding')
  },
  setBackupImages: (e) => {
    dispatch(setBackupImages(e.target.checked))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
