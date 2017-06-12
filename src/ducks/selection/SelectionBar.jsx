import { connect } from 'react-redux'
import { getSelectedIds, hideSelectionBar } from '.'
import SelectionBar from 'cozy-ui/react/SelectionBar'

const mapStateToProps = state => ({
  selected: getSelectedIds(state)
})

const mapDispatchToProps = dispatch => ({
  hideSelectionBar: () => dispatch(hideSelectionBar())
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectionBar)
