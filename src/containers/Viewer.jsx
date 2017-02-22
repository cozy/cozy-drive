import styles from '../styles/viewer'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Hammer from 'hammerjs'

import { STACK_FILES_DOWNLOAD_PATH } from '../constants/config'

import ViewerToolbar from '../containers/ViewerToolbar'

const KEY_CODE_LEFT = 37
const KEY_CODE_RIGHT = 39

export class Viewer extends Component {
  constructor (props) {
    super(props)
    this.navigateToPhoto = this.navigateToPhoto.bind(this)
  }

  componentDidMount () {
    this.onKeyDownCallback = this.onKeyDown.bind(this)
    document.addEventListener('keydown', this.onKeyDownCallback, false)

    this.gesturesHandler = new Hammer(this.viewer)
    this.gesturesHandler.on('swipe', this.onSwipe.bind(this))
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onKeyDownCallback, false)
    this.gesturesHandler.destroy()
  }

  onKeyDown (e) {
    if (e.keyCode === KEY_CODE_LEFT) this.navigateToPhoto(this.props.previous)
    else if (e.keyCode === KEY_CODE_RIGHT) this.navigateToPhoto(this.props.next)
  }

  onSwipe (e) {
    if (e.direction === Hammer.DIRECTION_LEFT) this.navigateToPhoto(this.props.next)
    else if (e.direction === Hammer.DIRECTION_RIGHT) this.navigateToPhoto(this.props.previous)
  }

  navigateToPhoto (id) {
    let url = this.props.router.location.pathname
    let parentPath = url.substring(0, url.lastIndexOf('/'))

    this.props.router.push(`${parentPath}/${id}`)
  }

  render () {
    const { current, previous, next } = this.props
    return (
      <div className={styles['pho-viewer-wrapper']} role='viewer' ref={viewer => { this.viewer = viewer }}>
        <ViewerToolbar />
        <div className={styles['pho-viewer-content']}>
          <a role='button' className={styles['pho-viewer-nav-previous']} onClick={() => this.navigateToPhoto(previous)} />
          <div className={styles['pho-viewer-photo']}>
            <img
              src={`${STACK_FILES_DOWNLOAD_PATH}/${current}`}
            />
          </div>
          <a role='button' className={styles['pho-viewer-nav-next']} onClick={() => this.navigateToPhoto(next)} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let set = state.photos.map(photo => photo._id)
  let current = ownProps.params.photoId
  let currentPhotoIndex = set.indexOf(current)

  let next = set[(currentPhotoIndex + 1) % set.length]
  let previous = set[currentPhotoIndex - 1 > 0 ? currentPhotoIndex - 1 : set.length - 1]

  return {
    current,
    previous,
    next
  }
}

export default connect(
  mapStateToProps
)(withRouter(Viewer))
