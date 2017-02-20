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
    if (e.keyCode === KEY_CODE_LEFT) this.props.navigateToPhoto(this.props.previous)
    else if (e.keyCode === KEY_CODE_RIGHT) this.props.navigateToPhoto(this.props.next)
  }

  onSwipe (e) {
    if (e.direction === Hammer.DIRECTION_LEFT) this.props.navigateToPhoto(this.props.next)
    else if (e.direction === Hammer.DIRECTION_RIGHT) this.props.navigateToPhoto(this.props.previous)
  }

  render ({ current, previous, next, navigateToPhoto }) {
    return (
      <div className={styles['pho-viewer-wrapper']} role='viewer' ref={viewer => { this.viewer = viewer }}>
        <ViewerToolbar />
        <div className={styles['pho-viewer-content']}>
          <a role='button' className={styles['pho-viewer-nav-previous']} onClick={() => navigateToPhoto(previous)} />
          <div className={styles['pho-viewer-photo']}>
            <img
              src={`${STACK_FILES_DOWNLOAD_PATH}/${current}`}
            />
          </div>
          <a role='button' className={styles['pho-viewer-nav-next']} onClick={() => navigateToPhoto(next)} />
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

export const mapDispatchToProps = (dispatch, ownProps) => ({
  navigateToPhoto: id => {
    let url = ownProps.router.location.pathname
    let parentPath = url.substring(0, url.lastIndexOf('/'))

    ownProps.router.push(`${parentPath}/${id}`)
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Viewer))
