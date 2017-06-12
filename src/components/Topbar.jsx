import styles from '../styles/topbar'

import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { withRouter } from 'react-router'

const KEYCODE_ENTER = 13
const KEYCODE_ESC = 27

class Topbar extends Component {
  constructor (props) {
    super(props)

    this.ignoreBlurEvent = false// we'll ignore blur events if they are triggered by pressing enter or escape, to prevent `onEdit` from firing twice
    this.inputElement = null

    this.backToAlbums = this.backToAlbums.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidUpdate () {
    if (this.inputElement !== null) {
      this.inputElement.focus()
      this.inputElement.select()
    }
  }

  backToAlbums () {
    // go to parent
    let url = this.props.router.location.pathname
    this.props.router.push(url.substring(0, url.lastIndexOf('/')))
  }

  handleBlur (e) {
    if (!this.ignoreBlurEvent && this.props.onEdit) this.props.onEdit(e.target.value.trim() !== '' ? e.target.value : this.props.albumName)
  }

  handleKeyDown (e) {
    if (e.keyCode === KEYCODE_ENTER && this.props.onEdit) {
      this.ignoreBlurEvent = true
      this.props.onEdit(e.target.value)
    } else if (e.keyCode === KEYCODE_ESC && this.props.onEdit) {
      this.ignoreBlurEvent = true
      this.props.onEdit(this.props.albumName)
    }
  }

  render ({ t, children, viewName, albumName = '', editing = false }) {
    return (
      <div className={styles['pho-content-header']}>
        {viewName === 'albumContent' &&
          <div
            role='button'
            className={styles['pho-content-album-previous']}
            onClick={this.backToAlbums}
          />
        }
        <h2 className={styles['pho-content-title']}>
          {
            viewName !== 'albumContent'
            ? t(`Nav.${viewName}`)
            : editing
            ? <input type='text' value={albumName} onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} ref={elem => { this.inputElement = elem }} />
            : albumName
          }
        </h2>
        {children}
      </div>
    )
  }
}

export default translate()(withRouter(Topbar))
