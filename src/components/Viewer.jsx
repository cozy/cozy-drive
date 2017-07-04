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

  componentDidMount () {
    this.onKeyDownCallback = this.onKeyDown.bind(this)
    document.addEventListener('keydown', this.onKeyDownCallback, false)

    this.gesturesHandler = new Hammer(this.viewer)
    this.gesturesHandler.on('swipe', this.onSwipe.bind(this))

    let initialScale = 0

    this.gesturesHandler.get('pinch').set({ enable: true })
    this.gesturesHandler.get('pan').set({ direction: Hammer.DIRECTION_ALL })

    // During a gesture, everything is computed with a base value (the state of the image when the gesture starts) and a delta (a translation / zoom, described by the gesture). When a gesture starts, we record the current state of the image
    this.gesturesHandler.on('panstart', this.saveInitialOffsetAndScale.bind(this))
    this.gesturesHandler.on('pinchstart', this.saveInitialOffsetAndScale.bind(this))

    // during a pan, we add the gestures delta to the initial offset to get the new offset. The new offset is then scaled : if the pan distance was 100px, but the image was scaled 2x, the actual offset should only be 50px. FInally, this value is clamped to make sure the user can't pan further than the edges.
    this.gesturesHandler.on('pan', e => {
      this.setState(state => {
        const maxOffset = this.computeMaxOffset()
        return {
          offsetX: clamp(-maxOffset.x, state.initialOffset.x + e.deltaX / state.scale, maxOffset.x),
          offsetY: clamp(-maxOffset.y, state.initialOffset.y + e.deltaY / state.scale, maxOffset.y),
        }
      })
    })

    // pinching / zooming / scaling is a bit more complicated, because the gesture's center has to be taken into account
    this.gesturesHandler.on('pinch', e => {
      this.setState((state) => {
        // first we compute the scale factor: this is the number by which we will multiply the initial scale (as it was before the gesture started) to get the final scaling value. So if the initial scale is 2, and the scale factor is 1.5, the final scale will be 3.
        // this value is clamped so so it stays within reasonable zoom limits.
        let scaleFactor = clamp(MIN_SCALE / state.initialScale, e.scale, MAX_SCALE / state.initialScale)

        // When the user is zooming in or out, we want that the origin point of the gesture stays in exactly the same place. The scaling origin is in the center of the viewer.
        // If the gesture's origin is the same as the scaling origin, this works "out of the box" — you can imagine the pixels on all sides being "pushed" towards the outside. But if the gesture's origin is not in the center, we need to offset the whole image to produce the illusion that the scaling center is there.

        // compute the center of the viewer
        let wrapperBoundaries = this.viewer.getBoundingClientRect()
        const viewerCenter= {
          x: (wrapperBoundaries.right - wrapperBoundaries.left) / 2,
          y: (wrapperBoundaries.bottom - wrapperBoundaries.top) / 2
        }

        // Compute the delta between the viewer's center and the gesture's center. This value is scaled back to the "natural" size — if the delta is 100px but the image is currently scale 2x, the real offset value is only 50px.
        const offsetBeforeScale = {
          x: (viewerCenter.x - e.center.x) / state.scale,
          y: (viewerCenter.y - e.center.y) / state.scale
        }

        // Now we compute what this offset will be once we apply the new scale
        const offsetAfterScale = {
          x: offsetBeforeScale.x * scaleFactor,
          y: offsetBeforeScale.y * scaleFactor
        }

        // finally, we compute the actual offset we want to apply. This is the difference between the offset *after* scaling and the offset *before* scaling. We also add any existing offset to preserve it (otherwise it is reset to the center each time)
        const finalOffset = {
          x: offsetAfterScale.x - offsetBeforeScale.x + state.initialOffset.x,
          y: offsetAfterScale.y - offsetBeforeScale.y + state.initialOffset.y
        }

        // last thing: the offsets are clamped to make sure the offsetting doesn't go further than the edges
        const maxOffset = this.computeMaxOffset()

        return {
          scale: state.initialScale * scaleFactor,
          offsetX: clamp(-maxOffset.x, finalOffset.x, maxOffset.x),
          offsetY: clamp(-maxOffset.y, finalOffset.y, maxOffset.y)
        }
      })
    })

    this.gesturesHandler.on('panend', e => {
      // @TODO: handle remaining velocity
    })

    this.gesturesHandler.on('tap', this.toggleToolbar.bind(this))

    this.hideToolbarAfterDelay()
  }

  /**
   * Compute the maximum offset that can be applied to the photo on each axis before it goes over the edges
   * @returns {object} A point with an x and y property
   */
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

  /**
   * Persist the current scale and offset to the state. This is called at the begining of gestures and the values saved are used as "base values" for the calculation
   */
  saveInitialOffsetAndScale () {
    this.setState(state => ({
      initialScale: state.scale,
      initialOffset: {
        x: state.offsetX,
        y: state.offsetY
      },
    }))
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
