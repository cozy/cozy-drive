import { connect } from 'react-redux'
import { isNavigating } from 'drive/web/modules/navigation/duck'
import { getCurrentViewFetchStatus } from 'drive/web/modules/selectors'

const AsyncBoundary = ({ fetchStatus, isNavigating = false, children }) => {
  const fetchFailed = fetchStatus === 'failed'
  const fetchPending = fetchStatus === 'pending'
  const isLoading = fetchPending || isNavigating

  return children({ isLoading, isNavigating, isInError: fetchFailed })
}

const mapStateToProps = state => ({
  isNavigating: isNavigating(state),
  fetchStatus: getCurrentViewFetchStatus(state)
})

export default connect(mapStateToProps)(AsyncBoundary)
