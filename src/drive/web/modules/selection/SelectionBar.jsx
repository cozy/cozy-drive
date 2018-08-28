import { connect } from 'react-redux'
import SelectionBar from 'cozy-ui/react/SelectionBar'
import { hideSelectionBar } from './duck'

const mapDispatchToProps = dispatch => ({
  hideSelectionBar: () => dispatch(hideSelectionBar())
})

export default connect(null, mapDispatchToProps)(SelectionBar)
