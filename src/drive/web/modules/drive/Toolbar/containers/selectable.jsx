import { connect } from 'react-redux'

import { showSelectionBar } from 'drive/web/modules/selection/duck'
const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = dispatch => ({
  showSelectionBar: () => dispatch(showSelectionBar())
})

const selectableContainer = component =>
  connect(mapStateToProps, mapDispatchToProps)(component)

export default selectableContainer
