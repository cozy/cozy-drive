import { connect } from 'react-redux'
import Settings from '../components/Settings'
import { setWifiOnly } from '../actions/settings'
import { showUnlinkConfirmation, hideUnlinkConfirmation, unlink } from '../actions/unlink'
import { backupImages, startMediaBackup, cancelMediaBackup } from '../actions/mediaBackup'
import { backupAllowed } from '../lib/network'

const mapStateToProps = (state, ownProps) => ({
  mediaUploading: state.mobile.mediaBackup.uploading,
  backupImages: state.mobile.settings.backupImages,
  displayUnlinkConfirmation: state.mobile.ui.displayUnlinkConfirmation,
  client: state.settings.client,
  wifiOnly: state.mobile.settings.wifiOnly,
  backupAllowed: backupAllowed(state.mobile.settings.wifiOnly)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleBackup: (launch, dir) => {
    if (launch) {
      dispatch(startMediaBackup(dir, true))
    } else {
      dispatch(cancelMediaBackup())
    }
  },
  showUnlinkConfirmation: () => dispatch(showUnlinkConfirmation()),
  hideUnlinkConfirmation: () => dispatch(hideUnlinkConfirmation()),
  unlink: (client) => {
    dispatch(unlink(client))
    ownProps.router.replace('/onboarding')
  },
  setBackupImages: (e) => dispatch(backupImages(e.target.checked)),
  setWifiOnly: async (e) => {
    await dispatch(setWifiOnly(e.target.checked))
    dispatch(backupImages())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
