import React from 'react'
import useActions from './useActions'
import SelectionBar from 'drive/web/modules/selection/SelectionBar'

const SelectionBarWithActions = ({ documentId, ...props }) => {
  const actions = useActions(documentId, { canMove: true })

  return <SelectionBar {...props} actions={actions} />
}

export default SelectionBarWithActions
