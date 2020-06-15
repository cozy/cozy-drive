import React from 'react'
import useActions from 'drive/web/modules/actions/useActions'
import { FileWithSelection } from 'drive/web/modules/filelist/File'

const FileWithActions = props => {
  const { attributes } = props
  const actions = useActions(attributes._id, { canMove: true })

  return <FileWithSelection {...props} actions={actions} />
}

export default FileWithActions
