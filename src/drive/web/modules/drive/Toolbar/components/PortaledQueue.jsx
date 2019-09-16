import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { UploadQueue } from 'drive/web/modules/upload/UploadQueue'
import { translate } from 'cozy-ui/transpiled/react'
class PortaledQueue extends Component {
  state = {
    display: true
  }
  /**
   *
   * This is the only way to re-display the Queue
   * after a scann if it was previously manually hidden
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.doneCount !== nextProps.successCount &&
      prevState.display === false
    ) {
      return {
        display: true
      }
    }
    return prevState
  }

  render() {
    const { file, doneCount, successCount, t } = this.props
    const { display } = this.state
    if (!display && doneCount === successCount) return null
    return ReactDOM.createPortal(
      <UploadQueue
        queue={file ? [file] : []}
        doneCount={doneCount}
        successCount={successCount}
        t={t}
        purgeQueue={() => {
          this.setState({ display: false })
        }}
      />,
      document.querySelector('[role=application]')
    )
  }
}

export default translate()(PortaledQueue)
