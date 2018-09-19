import React from 'react'
import selectableContainer from './selectable'
const SelectableItem = props => {
  return React.cloneElement(props.children, { onClick: props.showSelectionBar })
}

export default selectableContainer(SelectableItem)
