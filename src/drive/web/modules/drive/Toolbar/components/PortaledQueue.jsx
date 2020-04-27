import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { DumbUploadQueue as UploadQueue } from 'drive/web/modules/upload/UploadQueue'
import { translate } from 'cozy-ui/transpiled/react'
class PortaledQueue extends Component {
  render() {
    const { file, doneCount, successCount, t, onClear } = this.props

    return ReactDOM.createPortal(
      <UploadQueue
        queue={file ? [file] : []}
        doneCount={doneCount}
        successCount={successCount}
        t={t}
        purgeQueue={onClear}
      />,
      document.querySelector('[role=application]')
    )
  }
}

export default translate()(PortaledQueue)
