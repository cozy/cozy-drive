import { connect } from 'react-redux'
import Settings from '../components/Settings'
import { updateSettings, showUnlinkConfirmation, hideUnlinkConfirmation, unlink } from '../actions'
import { mediaBackup } from '../actions/media_backup'

const mapStateToProps = (state, ownProps) => ({
  mediaUploading: state.mediaBackup.uploading,
  version: window.navigator.appInfo ? window.navigator.appInfo.version : 'dev',
  serverUrl: state.mobile.settings.serverUrl,
  backupImages: state.mobile.settings.backupImages,
  displayUnlinkConfirmation: state.mobile.settings.displayUnlinkConfirmation
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  launchBackup: () => dispatch(mediaBackup()),
  showUnlinkConfirmation: () => dispatch(showUnlinkConfirmation()),
  hideUnlinkConfirmation: () => dispatch(hideUnlinkConfirmation()),
  unlink: () => {
    dispatch(unlink())
    ownProps.router.replace('/onboarding')
  },
  setBackupImages: (e) => {
    dispatch(updateSettings({ backupImages: e.target.checked }))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
