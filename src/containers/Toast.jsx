import { connect } from 'react-redux'
import Toast from '../components/Toast'
import { hideToast } from '../actions'

const mapStateToProps = state => ({
  message: state.ui.toastMessage.message,
  duration: state.ui.toastMessage.duration
})

const mapDispatchToProps = dispatch => ({
  hideToast: () => dispatch(hideToast())
})

export default connect(mapStateToProps, mapDispatchToProps)(Toast)
