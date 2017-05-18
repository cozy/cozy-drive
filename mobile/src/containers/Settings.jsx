import { connect } from 'react-redux'
import Settings from '../components/Settings'
import { showUnlinkConfirmation, hideUnlinkConfirmation, unlink } from '../actions/unlink'

const mapStateToProps = (state, ownProps) => ({
  displayUnlinkConfirmation: state.mobile.ui.displayUnlinkConfirmation,
  client: state.settings.client
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  showUnlinkConfirmation: () => dispatch(showUnlinkConfirmation()),
  hideUnlinkConfirmation: () => dispatch(hideUnlinkConfirmation()),
  unlink: (client) => {
    dispatch(unlink(client))
    ownProps.router.replace('/onboarding')
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
