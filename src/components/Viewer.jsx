/* global cozy */
import styles from '../styles/viewer'

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Hammer from 'hammerjs'

import ViewerToolbar from './ViewerToolbar'
import Loading from './Loading'
import ImageLoader from './ImageLoader'

const KEY_CODE_LEFT = 37
const KEY_CODE_RIGHT = 39

export class Viewer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isImageLoading: true,
      ...mapRouteToPhotos(props.photos, props.params)
    }

    this.navigateToPhoto = this.navigateToPhoto.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({...mapRouteToPhotos(nextProps.photos, nextProps.params)})
  }

  componentDidMount () {
    this.onKeyDownCallback = this.onKeyDown.bind(this)
    document.addEventListener('keydown', this.onKeyDownCallback, false)

    this.gesturesHandler = new Hammer(this.viewer)
    this.gesturesHandler.on('swipe', this.onSwipe.bind(this))
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onKeyDownCallback, false)
    // this.gesturesHandler.destroy()
  }

  onKeyDown (e) {
    if (e.keyCode === KEY_CODE_LEFT) this.navigateToPhoto(this.state.previousID)
    else if (e.keyCode === KEY_CODE_RIGHT) this.navigateToPhoto(this.state.nextID)
  }

  onSwipe (e) {
    if (e.direction === Hammer.DIRECTION_LEFT) this.navigateToPhoto(this.state.nextID)
    else if (e.direction === Hammer.DIRECTION_RIGHT) this.navigateToPhoto(this.state.previousID)
  }

  navigateToPhoto (id) {
    this.setState({ isImageLoading: true })
    const router = this.props.router
    const url = router.location.pathname
    const parentPath = url.substring(0, url.lastIndexOf('/'))
    router.push({ pathname: `${parentPath}/${id}`, query: router.location.query })
  }

  handleImageLoaded () {
    this.setState({ isImageLoading: false })
  }

  render () {
    const { isImageLoading, previousID, nextID, currentPhoto } = this.state
    return (
      <div className={styles['pho-viewer-wrapper']} role='viewer' ref={viewer => { this.viewer = viewer }}>
        <ViewerToolbar />
        <div className={styles['pho-viewer-content']}>
          <a role='button' className={styles['pho-viewer-nav-previous']} onClick={() => this.navigateToPhoto(previousID)} />
          <div className={styles['pho-viewer-photo']}>
            {currentPhoto &&
              <ImageLoader
                photo={currentPhoto}
                onLoad={this.handleImageLoaded}
                src={`${cozy.client._url}${currentPhoto.links.large}`}
              />
            }
            {(!currentPhoto || isImageLoading) &&
              <Loading noMargin color='white' />
            }
          </div>
          <a role='button' className={styles['pho-viewer-nav-next']} onClick={() => this.navigateToPhoto(nextID)} />
        </div>
      </div>
    )
  }
}

const mapRouteToPhotos = (photos = [], params) => {
  let set = photos.map(photo => photo._id)
  let currentID = params.photoId
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

export default withRouter(Viewer)
