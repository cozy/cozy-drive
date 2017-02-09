import { connect } from 'react-redux'
import Settings from '../Components/Settings'
import { updateSettings } from '../actions'

const mapStateToProps = (state, ownProps) => ({
  version: window.navigator.appInfo ? window.navigator.appInfo.version : 'dev',
  serverUrl: state.mobile.serverUrl,
  backupImages: state.mobile.settings.backupImages
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setBackupImages: (e) => {
    dispatch(updateSettings({ backupImages: e.target.checked }))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
