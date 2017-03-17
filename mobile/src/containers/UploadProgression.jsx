import { connect } from 'react-redux'
import UploadProgression from '../components/UploadProgression'

const mapStateToProps = (state) => ({
  message: state.mobile.mediaBackup.currentUpload ? state.mobile.mediaBackup.currentUpload.message : undefined,
  messageData: state.mobile.mediaBackup.currentUpload ? state.mobile.mediaBackup.currentUpload.messageData : undefined
})

export default connect(mapStateToProps)(UploadProgression)
