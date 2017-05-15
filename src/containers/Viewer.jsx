import styles from '../styles/viewer'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Hammer from 'hammerjs'

import { getPhotoLink } from '../actions/photos'
import { getAlbumPhotos } from '../ducks/albums'
import { getTimelineList } from '../ducks/timeline'

import ViewerToolbar from '../components/ViewerToolbar'
import Loading from '../components/Loading'

const KEY_CODE_LEFT = 37
const KEY_CODE_RIGHT = 39

export class Viewer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      imageUrl: '',
      isLoading: true,
      isImageLoading: true
    }

    this.navigateToPhoto = this.navigateToPhoto.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // get currentPhoto image if currentPhoto defined
    let currentPhoto = this.props.currentPhoto || nextProps.currentPhoto
    if (this.state.imageUrl === '' && currentPhoto !== undefined) {
      getPhotoLink(currentPhoto._id)
        .then(link => {
          this.setState({
            imageUrl: link,
            isLoading: false
          })
        })
    }
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
    if (e.keyCode === KEY_CODE_LEFT) this.navigateToPhoto(this.props.previousID)
    else if (e.keyCode === KEY_CODE_RIGHT) this.navigateToPhoto(this.props.nextID)
  }

  onSwipe (e) {
    if (e.direction === Hammer.DIRECTION_LEFT) this.navigateToPhoto(this.props.nextID)
    else if (e.direction === Hammer.DIRECTION_RIGHT) this.navigateToPhoto(this.props.previousID)
  }

  navigateToPhoto (id) {
    this.setState({imageUrl: '', isImageLoading: true, isLoading: true})
    let url = this.props.router.location.pathname
    let parentPath = url.substring(0, url.lastIndexOf('/'))

    this.props.router.push(`${parentPath}/${id}`)
  }

  handleImageLoaded () {
    this.setState({ isImageLoading: false })
  }

  render () {
    const { previousID, nextID, currentPhoto } = this.props
    const { imageUrl, isLoading, isImageLoading } = this.state
    return (
      <div className={styles['pho-viewer-wrapper']} role='viewer' ref={viewer => { this.viewer = viewer }}>
        <ViewerToolbar />
        <div className={styles['pho-viewer-content']}>
          <a role='button' className={styles['pho-viewer-nav-previous']} onClick={() => this.navigateToPhoto(previousID)} />
          <div className={styles['pho-viewer-photo']}>
            {!isLoading &&
              <img
                onLoad={this.handleImageLoaded}
                style={isImageLoading ? 'display:none' : ''}
                alt={currentPhoto.name}
                src={imageUrl}
              />
            }
            {(isLoading || isImageLoading) &&
              <Loading noMargin />
            }
          </div>
          <a role='button' className={styles['pho-viewer-nav-next']} onClick={() => this.navigateToPhoto(nextID)} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let photos = []
  if (ownProps.params.albumId) { // photos from an album
    photos = getAlbumPhotos(state, ownProps.params.albumId).entries
  } else { // all photos (timeline)
    photos = getTimelineList(state).entries
  }
  let set = photos.map(photo => photo._id)
  let currentID = ownProps.params.photoId
  let currentPhotoIndex = set.indexOf(currentID)
  let currentPhoto = photos[currentPhotoIndex]

  let nextID = set[(currentPhotoIndex + 1) % set.length]
  let previousID = set[currentPhotoIndex - 1 >= 0 ? currentPhotoIndex - 1 : set.length - 1]

  return {
    currentPhoto,
    previousID,
    nextID
  }
}

export default connect(
  mapStateToProps
)(withRouter(Viewer))
