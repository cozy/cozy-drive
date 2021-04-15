import React from 'react'

import Dialog from 'cozy-ui/transpiled/react/Dialog'

import Editor from 'drive/web/modules/views/OnlyOffice/Editor'

const OnlyOffice = props => {
  return (
    <Dialog open={true} fullScreen transitionDuration={0}>
      <Editor fileId={props.params.fileId} />
    </Dialog>
  )
}

export default OnlyOffice
