import { connect } from 'react-redux'
import { hideSelectionBar } from '.'
import SelectionBar from 'cozy-ui/react/SelectionBar'

const mapDispatchToProps = dispatch => ({
  hideSelectionBar: () => dispatch(hideSelectionBar())
})

export default connect(null, mapDispatchToProps)(SelectionBar)
