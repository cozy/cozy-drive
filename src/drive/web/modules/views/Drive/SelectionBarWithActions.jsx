import React from 'react'
import useActions from './useActions'
import SelectionBar from 'drive/web/modules/selection/SelectionBar'

const SelectionBarWithActions = ({ documentId, ...props }) => {
  const actions = useActions(documentId)

  return <SelectionBar {...props} actions={actions} />
}

export default SelectionBarWithActions
