import { connect } from 'react-redux'
import { getSelected, hideSelectionBar } from '.'
import SelectionBar from 'cozy-ui/react/SelectionBar'

const mapStateToProps = state => ({
  selected: getSelected(state)
})

const mapDispatchToProps = dispatch => ({
  hideSelectionBar: () => dispatch(hideSelectionBar())
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectionBar)
