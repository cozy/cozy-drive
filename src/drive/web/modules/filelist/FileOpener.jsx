import React, { Component } from 'react'
import Hammer from '@egjs/hammerjs'
import propagating from 'propagating-hammerjs'

import { enableTouchEvents } from './File'
import styles from './fileopener.styl'

class FileOpener extends Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount() {
    const {
      file,
      disabled,
      actionMenuVisible,
      toggle,
      open,
      selectionModeActive,
      isRenaming
    } = this.props
    this.gesturesHandler = propagating(new Hammer(this.myRef.current))
    this.gesturesHandler.on('tap onpress singletap', ev => {
      if (actionMenuVisible || disabled) return
      if (enableTouchEvents(ev)) {
        ev.preventDefault() // prevent a ghost click
        if (ev.type === 'onpress' || selectionModeActive) {
          ev.srcEvent.stopImmediatePropagation()
          toggle(ev.srcEvent)
        } else {
          ev.srcEvent.stopImmediatePropagation()
          if (!isRenaming) open(ev.srcEvent, file)
        }
      }
    })
  }

  componentWillUnmount() {
    this.gesturesHandler && this.gesturesHandler.destroy()
  }

  render() {
    const { file, children } = this.props

    return (
      <span className={styles['file-opener']} ref={this.myRef} id={file.id}>
        {children}
      </span>
    )
  }
}

export default FileOpener
