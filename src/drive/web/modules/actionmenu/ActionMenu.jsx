import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PopperJS from 'popper.js'

import Overlay from 'cozy-ui/transpiled/react/Overlay'
import { ActionsItems } from './ActionsItems'

import styles from 'drive/styles/actionmenu.styl'

class Menu extends Component {
  componentDidMount() {
    const { reference } = this.props
    // eslint-disable-next-line react/no-find-dom-node
    const anchorEl = ReactDOM.findDOMNode(reference)
    // eslint-disable-next-line react/no-find-dom-node
    const menuEl = ReactDOM.findDOMNode(this.menuEl)
    this.popper = new PopperJS(anchorEl, menuEl)
  }

  componentWillUnmount() {
    if (this.popper !== undefined) {
      this.popper.destroy()
    }
  }

  render() {
    const { file, actions, onClose } = this.props
    return (
      <div className={styles['fil-actionmenu']}>
        <Overlay
          onClick={onClose}
          onEscape={onClose}
          className={styles['fil-actionmenu-overlay']}
        />
        <div
          data-test-id="fil-actionmenu-inner"
          className={styles['fil-actionmenu-inner']}
          ref={el => {
            this.menuEl = el
          }}
        >
          <ActionsItems actions={actions} file={file} onClose={onClose} />
        </div>
      </div>
    )
  }
}

export default Menu
