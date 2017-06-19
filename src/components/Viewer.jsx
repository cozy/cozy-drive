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
      ...mapRouteToPhotos(props.photos, props.params),
      scale: 1,
      offsetX: 0,
      offsetY: 0
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

    let initialScale = 0
    let maxScale = 6

    let initialOffsetX = 0
    let initialOffsetY = 0
    let maxOffsetX = 0
    let maxOffsetY = 0

    this.gesturesHandler.get('pinch').set({ enable: true })
    this.gesturesHandler.get('pan').set({ direction: Hammer.DIRECTION_ALL })

    this.gesturesHandler.on('pinchstart', e => {
      initialScale = this.state.scale
    })

    this.gesturesHandler.on('pinch', e => {
      // @TODO: account for the pinch center, and translate the photo according to that (so that you can zoom into a specific point in the photo). There is a `center`property on `e` for that
      this.setState({
        scale: Math.max(1, Math.min(maxScale, initialScale + (e.scale - 1))) // scale is a factor computed by hammer, but it works pretty well. However, it starts at `1` a the begining of the gesture, but we want the difference from the exisitng, so we subtract 1
      })
    })

    this.gesturesHandler.on('panstart', e => {
      initialOffsetX = this.state.offsetX
      initialOffsetY = this.state.offsetY

      // prevent panning past the edges of the photo
      if (this.viewer && this.photo) {
        let wrapperBoundaries = this.viewer.getBoundingClientRect()
        let photoBoundaries = React.findDOMNode(this.photo).getBoundingClientRect()
        maxOffsetX = Math.max(photoBoundaries.width / 2 - wrapperBoundaries.width / 2, 0) / initialScale
        maxOffsetY = Math.max(photoBoundaries.height / 2 - wrapperBoundaries.height / 2, 0) / initialScale
      }
      else {
        maxOffsetX = maxOffsetY = 0
      }
    })
    this.gesturesHandler.on('pan', e => {
      // values are clamped, and the delta is adjusted for the scale
      this.setState({
        offsetX: Math.max(-maxOffsetX, Math.min(maxOffsetX, initialOffsetX + e.deltaX / initialScale)),
        offsetY: Math.max(-maxOffsetY, Math.min(maxOffsetY, initialOffsetY + e.deltaY / initialScale)),
      })
    })
    this.gesturesHandler.on('panend', e => {
      // @TODO: handle remaining velocity
    })
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
    // @TODO: probably disable when zoomed in

    if (e.direction === Hammer.DIRECTION_LEFT) this.navigateToPhoto(this.state.nextID)
    else if (e.direction === Hammer.DIRECTION_RIGHT) this.navigateToPhoto(this.state.previousID)
  }

  navigateToPhoto (id) {
    if (this.state.singlePhoto) return

    // @TODO: reset scale and offsets

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
    const { isImageLoading, previousID, nextID, currentPhoto, singlePhoto, scale, offsetX, offsetY } = this.state
    let style = {
      transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`
    }
    return (
      <div className={styles['pho-viewer-wrapper']} role='viewer' ref={viewer => { this.viewer = viewer }}>
        <ViewerToolbar />
        <div className={styles['pho-viewer-content']}>
          {!singlePhoto && <a role='button' className={styles['pho-viewer-nav-previous']} onClick={() => this.navigateToPhoto(previousID)} />}
          <div className={styles['pho-viewer-photo']}>
            {currentPhoto &&
              <ImageLoader
                photo={currentPhoto}
                onLoad={this.handleImageLoaded}
                src={`${cozy.client._url}${currentPhoto.links.large}`}
                style={style}
                ref={photo => { this.photo = photo }}
              />
            }
            {(!currentPhoto || isImageLoading) &&
              <Loading noMargin color='white' />
            }
          </div>
          {!singlePhoto && <a role='button' className={styles['pho-viewer-nav-next']} onClick={() => this.navigateToPhoto(nextID)} />}
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
    singlePhoto: currentID === previousID && currentID === nextID,
    currentPhoto,
    previousID,
    nextID
  }
}

export default withRouter(Viewer)
