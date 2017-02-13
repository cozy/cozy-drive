import { connect } from 'react-redux'
import Settings from '../components/Settings'
import { updateSettings, showUnlinkConfirmation, hideUnlinkConfirmation, unlink } from '../actions'

const mapStateToProps = (state, ownProps) => ({
  version: window.navigator.appInfo ? window.navigator.appInfo.version : 'dev',
  serverUrl: state.mobile.serverUrl,
  backupImages: state.mobile.settings.backupImages,
  displayUnlinkConfirmation: state.mobile.settings.displayUnlinkConfirmation
})

const mapDispatchToProps = (dispatch, ownProps) => ({
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
