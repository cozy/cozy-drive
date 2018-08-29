/* global cozy  */
import styles from '../styles/topbar'

import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { withBreakpoints } from 'cozy-ui/react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

const { BarCenter, BarRight } = cozy.bar

const KEYCODE_ENTER = 13
const KEYCODE_ESC = 27

class EditableAlbumName extends Component {
  constructor(props) {
    super(props)
    this.ignoreBlurEvent = false // we'll ignore blur events if they are triggered by pressing enter or escape, to prevent `onEdit` from firing twice
    this.inputElement = null
  }

  componentDidMount() {
    if (this.inputElement !== null) {
      this.inputElement.focus()
      this.inputElement.select()
    }
  }

  handleBlur = e => {
    if (!this.ignoreBlurEvent && this.props.onEdit)
      this.props.onEdit(
        e.target.value.trim() !== '' ? e.target.value : this.props.albumName
      )
  }

  handleKeyDown = e => {
    if (e.keyCode === KEYCODE_ENTER && this.props.onEdit) {
      this.ignoreBlurEvent = true
      this.props.onEdit(e.target.value)
    } else if (e.keyCode === KEYCODE_ESC && this.props.onEdit) {
      this.ignoreBlurEvent = true
      this.props.onEdit(this.props.albumName)
    }
  }

  render() {
    const { albumName } = this.props
    return (
      <input
        type="text"
        value={albumName}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
        ref={elem => {
          this.inputElement = elem
        }}
      />
    )
  }
}

EditableAlbumName.propTypes = {
  albumName: PropTypes.string,
  onEdit: PropTypes.func.isRequired
}

const TopbarTitle = ({ children }) => (
  <h2 className={styles['pho-content-title']}>{children}</h2>
)

class Topbar extends Component {
  backToAlbums = () => {
    // go to parent
    let url = this.props.router.location.pathname
    this.props.router.push(url.substring(0, url.lastIndexOf('/')))
  }

  renderTitle() {
    const { t, viewName, albumName = '', onEdit, editing = false } = this.props
    const isAlbumContent = viewName === 'albumContent'

    if (!isAlbumContent) return t(`Nav.${viewName}`)
    else if (editing)
      return <EditableAlbumName albumName={albumName} onEdit={onEdit} />
    else return albumName
  }

  render() {
    const { t, children, viewName, breakpoints: { isMobile } } = this.props
    const isAlbumContent = viewName === 'albumContent'
    const title = <TopbarTitle>{this.renderTitle()}</TopbarTitle>
    const responsiveTitle = isMobile ? <BarCenter>{title}</BarCenter> : title

    const menuWithTranslation = React.cloneElement(children, { t })
    const responsiveMenu = isMobile ? (
      <BarRight>{menuWithTranslation}</BarRight>
    ) : (
      menuWithTranslation
    )

    return (
      <div className={styles['pho-content-header']}>
        {isAlbumContent && (
          <div
            role="button"
            className={styles['pho-content-album-previous']}
            onClick={this.backToAlbums}
          />
        )}
        {responsiveTitle}
        {responsiveMenu}
      </div>
    )
  }
}

Topbar.propTypes = {
  viewName: PropTypes.string.isRequired,
  albumName: PropTypes.string,
  t: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  breakpoints: PropTypes.object.isRequired,
  children: PropTypes.node
}

export default withBreakpoints()(translate()(withRouter(Topbar)))
