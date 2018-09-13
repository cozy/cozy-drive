import React from 'react'
import selectionnableContainer from '../containers/selectionnable'
const SelectionnableItem = props => {
  return React.cloneElement(props.children, { onCLick: props.showSelectionBar })
}

export default selectionnableContainer(SelectionnableItem)
