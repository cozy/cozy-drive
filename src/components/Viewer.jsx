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
const TOOLBAR_HIDE_DELAY = 3000
const MIN_SCALE = 1
const MAX_SCALE = 6

const clamp = (min, value, max) => Math.max(min, Math.min(max, value))

export class Viewer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isImageLoading: true,
      ...mapRouteToPhotos(props.photos, props.params),
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      initialOffset: {
        x: 0,
        y: 0
      },
      initialScale: 0,
      hideToolbar: false
    }

    this.navigateToPhoto = this.navigateToPhoto.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)

    this.hideToolbarTimeout = null
  }

  componentWillReceiveProps (nextProps) {
    this.setState({...mapRouteToPhotos(nextProps.photos, nextProps.params)})
  }

  computeMaxOffset () {
    if (this.viewer && this.photo) {
      const wrapperBoundaries = this.viewer.getBoundingClientRect()
      const photoBoundaries = this.photo.getBoundingClientRect()

      return {
        x: Math.max(photoBoundaries.width / 2 - wrapperBoundaries.width / 2, 0) / this.state.scale,
        y: Math.max(photoBoundaries.height / 2 - wrapperBoundaries.height / 2, 0) / this.state.scale
      }
    } else {
      return {
        x :0,
        y: 0
      }
    }
  }

  saveInitialState () {
    this.setState(state => ({
      initialScale: state.scale,
      initialOffset: {
        x: state.offsetX,
        y: state.offsetY
      },
    }))
  }

  componentDidMount () {
    this.onKeyDownCallback = this.onKeyDown.bind(this)
    document.addEventListener('keydown', this.onKeyDownCallback, false)

    this.gesturesHandler = new Hammer(this.viewer)
    this.gesturesHandler.on('swipe', this.onSwipe.bind(this))

    let initialScale = 0

    this.gesturesHandler.get('pinch').set({ enable: true })
    this.gesturesHandler.get('pan').set({ direction: Hammer.DIRECTION_ALL })

    this.gesturesHandler.on('panstart', this.saveInitialState.bind(this))
    this.gesturesHandler.on('pinchstart', this.saveInitialState.bind(this))

    this.gesturesHandler.on('pan', e => {
      // values are clamped, and the delta is adjusted for the scale
      this.setState(state => {
        const maxOffset = this.computeMaxOffset()
        return {
          offsetX: clamp(-maxOffset.x, state.initialOffset.x + e.deltaX / state.scale, maxOffset.x),
          offsetY: clamp(-maxOffset.y, state.initialOffset.y + e.deltaY / state.scale, maxOffset.y),
        }
      })
    })

    this.gesturesHandler.on('pinch', e => {
      this.setState((state) => {
        let wrapperBoundaries = this.viewer.getBoundingClientRect()
        let photoCenterX = (wrapperBoundaries.right - wrapperBoundaries.left) / 2
        let photoCenterY = (wrapperBoundaries.bottom - wrapperBoundaries.top) / 2

        let gestureX = e.center.x
        let gestureY = e.center.y

        let scaleFactor = clamp(MIN_SCALE / state.initialScale, e.scale, MAX_SCALE / state.initialScale)

        let initialDeltaX = (photoCenterX - gestureX) / state.scale
        let initialDeltaY = (photoCenterY - gestureY) / state.scale

        let deltaXAfterZoom = initialDeltaX * scaleFactor
        let deltaYAfterZoom = initialDeltaY * scaleFactor

        let finalX = deltaXAfterZoom - initialDeltaX + state.initialOffset.x
        let finalY = deltaYAfterZoom - initialDeltaY + state.initialOffset.y

        const maxOffset = this.computeMaxOffset()

        return {
          scale: state.initialScale * scaleFactor,
          offsetX: clamp(-maxOffset.x, finalX, maxOffset.x),
          offsetY: clamp(-maxOffset.y, finalY, maxOffset.y)
        }
      })
    })

    this.gesturesHandler.on('panend', e => {
      // @TODO: handle remaining velocity
    })

    this.gesturesHandler.on('tap', this.toggleToolbar.bind(this))

    this.hideToolbarAfterDelay()
  }

  componentDidUpdate (prevProps, prevState) {
    // if the toolbar was hidden but is now displayed, start a countdown to hide it again
    if (prevState.hideToolbar && !this.state.hideToolbar) this.hideToolbarAfterDelay()
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
    this.setState({
      isImageLoading: true,
      hideToolbar: true
    })
    const router = this.props.router
    const url = router.location.pathname
    const parentPath = url.substring(0, url.lastIndexOf('/'))
    router.push({ pathname: `${parentPath}/${id}`, query: router.location.query })
  }

  handleImageLoaded () {
    this.setState({ isImageLoading: false })
  }

  toggleToolbar () {
    this.setState(state => ({...state, hideToolbar: !state.hideToolbar}))
  }

  hideToolbarAfterDelay () {
    clearTimeout(this.hideToolbarTimeout)
    this.hideToolbarTimeout = setTimeout(() => {
      this.setState({ hideToolbar: true })
    }, TOOLBAR_HIDE_DELAY)
  }

  render () {
    const { isImageLoading, previousID, nextID, currentPhoto, singlePhoto, hideToolbar, scale, offsetX, offsetY } = this.state
    let style = {
      transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`
    }
    return (
      <div className={styles['pho-viewer-wrapper']} role='viewer' ref={viewer => { this.viewer = viewer }}>
        <ViewerToolbar hidden={hideToolbar} />
        <div className={styles['pho-viewer-content']}>
          {!singlePhoto && <a role='button' className={styles['pho-viewer-nav-previous']} onClick={() => this.navigateToPhoto(previousID)} />}
          <div className={styles['pho-viewer-photo']}>
            {currentPhoto &&
              <ImageLoader
                photo={currentPhoto}
                onLoad={this.handleImageLoaded}
                src={`${cozy.client._url}${currentPhoto.links.large}`}
                style={style}
                ref={photo => { this.photo = React.findDOMNode(photo) }}
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
