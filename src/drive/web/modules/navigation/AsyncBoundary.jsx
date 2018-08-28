import { connect } from 'react-redux'
import { isNavigating } from 'drive/web/modules/navigation/duck'

const AsyncBoundary = ({ fetchStatus, isNavigating = false, children }) => {
  const fetchFailed = fetchStatus === 'failed'
  const fetchPending = fetchStatus === 'pending'
  const isLoading = fetchPending || isNavigating

  return children({ isLoading, isNavigating, isInError: fetchFailed })
}

const mapStateToProps = (state, ownProps) => ({
  isNavigating: isNavigating(state),
  fetchStatus: state.view.fetchStatus
})

export default connect(mapStateToProps)(AsyncBoundary)
