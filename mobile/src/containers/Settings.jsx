import { connect } from 'react-redux'
import Settings from '../components/Settings'
import { setBackupImages, setWifiOnly } from '../actions/settings'
import { showUnlinkConfirmation, hideUnlinkConfirmation, unlink } from '../actions/unlink'
import { mediaBackup, startMediaUpload, endMediaUpload } from '../actions/mediaBackup'

const mapStateToProps = (state, ownProps) => ({
  mediaUploading: state.mobile.mediaBackup.uploading,
  version: window.navigator.appInfo ? window.navigator.appInfo.version : 'dev',
  serverUrl: state.mobile.settings.serverUrl,
  backupImages: state.mobile.settings.backupImages,
  displayUnlinkConfirmation: state.mobile.ui.displayUnlinkConfirmation,
  client: state.mobile.settings.client,
  wifiOnly: state.mobile.settings.wifiOnly
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
  },
  setWifiOnly: (e) => {
    dispatch(setWifiOnly(e.target.checked))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
