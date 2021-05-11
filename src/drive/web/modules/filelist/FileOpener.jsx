import React, { Component } from 'react'
import Hammer from '@egjs/hammerjs'
import propagating from 'propagating-hammerjs'

import { shouldBeOpenedByOnlyOffice } from 'cozy-client/dist/models/file'

import {
  isOnlyOfficeEnabled,
  makeOnlyOfficeFileRoute
} from 'drive/web/modules/views/OnlyOffice/helpers'

import styles from './fileopener.styl'

const getParentDiv = element => {
  if (element.nodeName.toLowerCase() === 'div') {
    return element
  }
  return getParentDiv(element.parentNode)
}

export const getParentLink = element => {
  if (!element) {
    return null
  }

  if (element.nodeName.toLowerCase() === 'a') {
    return element
  }

  return getParentLink(element.parentNode)
}

const enableTouchEvents = ev => {
  // remove event when you rename a file
  if (['INPUT', 'BUTTON'].indexOf(ev.target.nodeName) !== -1) {
    return false
  }

  const parentDiv = getParentDiv(ev.target)
  // remove event when it's the checkbox or the more button
  if (
    parentDiv.className.indexOf(styles['fil-content-file-select']) !== -1 ||
    parentDiv.className.indexOf(styles['fil-content-file-action']) !== -1
  ) {
    return false
  }

  // remove events when they are on the file's path, because it's a different behavior
  const parentLink = getParentLink(ev.target)
  if (
    parentLink &&
    parentLink.className.indexOf(styles['fil-file-path']) >= 0
  ) {
    return false
  }

  return true
}

class FileOpener extends Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount() {
    this.gesturesHandler = propagating(new Hammer(this.myRef.current))
    this.gesturesHandler.on('tap onpress singletap', ev => {
      //don't read the props to early. Read them only in the callback
      const {
        file,
        disabled,
        actionMenuVisible,
        toggle,
        open,
        selectionModeActive,
        isRenaming
      } = this.props
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

    if (isOnlyOfficeEnabled() && shouldBeOpenedByOnlyOffice(file)) {
      return (
        <a
          data-testid="onlyoffice-link"
          className={`${styles['file-opener']} ${styles['file-opener__a']}`}
          ref={this.myRef}
          id={file.id}
          href={makeOnlyOfficeFileRoute(file)}
          onClick={ev => {
            ev.preventDefault()
          }}
        >
          {children}
        </a>
      )
    }

    return (
      <span
        data-testid="not-onlyoffice-span"
        className={styles['file-opener']}
        ref={this.myRef}
        id={file.id}
      >
        {children}
      </span>
    )
  }
}

export default FileOpener
