import styles from './styles'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Hammer from 'hammerjs'

import Spinner from 'cozy-ui/react/Spinner'
import { ImageLoader } from 'components/Image'

import NoNetworkViewer from './NoNetworkViewer'

const MIN_SCALE = 1
const MAX_SCALE = 6
const MASS = 10 // If a paning gesture is released while the finger is still moving, the photo will keep paning for a little longer (a if you threw the photo). MASS determines how much the photo will keep paning (the higher the number, the more it will keep going)
const FRICTION = 0.9 // When the photo is paning after a pan gesture ended suddenly, FRICTION determines how quickly the movement slows down. 0 would stop it imediately, 1 doesn't slow it down at all.

const clamp = (min, value, max) => Math.max(min, Math.min(max, value))

export default class ImageViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      canceled: false,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      initialOffset: {
        x: 0,
        y: 0
      },
      initialScale: 0,
      momentum: {
        x: 0,
        y: 0
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.file &&
      this.props.file &&
      nextProps.file.id !== this.props.file.id
    ) {
      this.tearDownGestures()
      this.setState({
        loading: true,
        canceled: false,
        scale: 1,
        offsetX: 0,
        offsetY: 0
      })
    }
  }

  componentDidMount() {
    if (this.props.gestures) this.initGestures()
  }

  componentDidUpdate(prevProps, prevState) {
    const wasLoading =
      prevState.loading && !this.state.loading && !this.state.canceled
    if (!prevProps.gestures) this.initGestures()
    if (wasLoading) this.setupGestures()
  }

  componentWillUnmount() {
    this.tearDownGestures()
  }

  reload = () => {
    this.setState(state => ({
      ...state,
      loading: true,
      canceled: false
    }))
  }

  onImageError = () => {
    this.setState(state => ({ ...state, loading: false, canceled: true }))
  }

  onImageLoad = () => {
    this.setState(state => ({ ...state, loading: false }))
  }

  tearDownGestures() {
    this.gestures.off('swipe')
    this.gestures.on('swipe', this.props.onSwipe)
    this.gestures.off('panstart')
    this.gestures.off('pinchstart')
    this.gestures.off('pinchend')
    this.gestures.off('pan')
    this.gestures.off('pinch')
    this.gestures.off('panend')
  }

  onSwipe = e => {
    // when a swipe happens while zoomed into an image, it's most likely a pan gesture and not a swipe
    if (this.state.scale > 1) return
    // a pan event is triggered after the swipe and may trigger a getBoundingClientRect error
    this.gestures.off('pan')
    this.gestures.off('panend')
    this.props.onSwipe(e)
  }

  initGestures() {
    this.gestures = this.props.gestures
    this.viewer = this.props.gesturesRef
  }

  setupGestures() {
    // We replace the swipe handler by ours
    this.gestures.off('swipe')
    this.gestures.on('swipe', this.onSwipe)

    this.gestures.get('pinch').set({ enable: true })
    this.gestures.get('pan').set({ direction: Hammer.DIRECTION_ALL })

    // During a gesture, everything is computed with a base value (the state of the image when the gesture starts) and a delta (a translation / zoom, described by the gesture). When a gesture starts, we record the current state of the image.
    this.gestures.on('panstart', this.prepareForGesture.bind(this))
    this.gestures.on('pinchstart', this.prepareForGesture.bind(this))
    // It frequently happens that at the end of a pinch gesture, a pan gesture is detected — because the fingers don't come off the screen at exactly the same time. Reseting the values at the end of the pinch makes sure the values are correct for the (accidental) pan event.
    this.gestures.on('pinchend', this.prepareForGesture.bind(this))

    // during a pan, we add the gestures delta to the initial offset to get the new offset. The new offset is then scaled : if the pan distance was 100px, but the image was scaled 2x, the actual offset should only be 50px. FInally, this value is clamped to make sure the user can't pan further than the edges.
    this.gestures.on('pan', e => {
      this.setState(state => {
        const maxOffset = this.computeMaxOffset()
        return {
          offsetX: clamp(
            -maxOffset.x,
            state.initialOffset.x + e.deltaX / state.scale,
            maxOffset.x
          ),
          offsetY: clamp(
            -maxOffset.y,
            state.initialOffset.y + e.deltaY / state.scale,
            maxOffset.y
          )
        }
      })
    })

    // pinching / zooming / scaling is a bit more complicated, because the gesture's center has to be taken into account
    this.gestures.on('pinch', e => {
      if (e.isFinal) return // hard to reproduce, but the final event seems to be causing problems and since it's just replaying the previous event, it can safely be discared

      this.setState(state => {
        // first we compute the scale factor: this is the number by which we will multiply the initial scale (as it was before the gesture started) to get the final scaling value. So if the initial scale is 2, and the scale factor is 1.5, the final scale will be 3.
        // this value is clamped so so it stays within reasonable zoom limits.
        let scaleFactor = clamp(
          MIN_SCALE / state.initialScale,
          e.scale,
          MAX_SCALE / state.initialScale
        )

        // When the user is zooming in or out, we want that the origin point of the gesture to stay in exactly the same place. The scaling origin is in the center of the viewer.
        // If the gesture's origin is the same as the scaling origin, this works "out of the box" — you can imagine the pixels on all sides being "pushed" towards the outside. But if the gesture's origin is not in the center, we need to offset the whole image to produce the illusion that the scaling center is there.

        // compute the center of the viewer
        let wrapperBoundaries = this.viewer.getBoundingClientRect()
        const viewerCenter = {
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

    this.gestures.on('panend', e => {
      // convert the remaining velocity into momentum
      this.setState(
        {
          momentum: {
            x: e.velocityX * MASS,
            y: e.velocityY * MASS
          }
        },
        this.applyMomentum.bind(this)
      )
    })
  }

  render() {
    if (this.state.canceled) {
      return <NoNetworkViewer onReload={this.reload} />
    }
    const { file } = this.props
    const { scale, offsetX, offsetY } = this.state
    const style = {
      transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`
    }
    return (
      <div
        data-test-id="viewer-image"
        className={styles['pho-viewer-imageviewer']}
      >
        {this.state.loading && (
          <Spinner size="xxlarge" middle noMargin color="white" />
        )}
        {file && (
          <ImageLoader
            file={file}
            size="large"
            ref={photo => {
              //eslint-disable-next-line
              this.photo = ReactDOM.findDOMNode(photo)
            }}
            onError={this.onImageError}
            key={file.id}
            render={src => (
              <img
                style={style}
                alt={file.name}
                src={src}
                onLoad={this.onImageLoad}
              />
            )}
          />
        )}
      </div>
    )
  }

  /**
   * Things to do when a gesture starts:
   * - saves the current scale and offset, which will be used as base values for calculations
   * - kill any remaining momentum from previous gestures
   * - hide the actions
   */
  prepareForGesture() {
    this.setState(state => ({
      initialScale: state.scale,
      initialOffset: {
        x: state.offsetX,
        y: state.offsetY
      },
      momentum: {
        x: 0,
        y: 0
      }
    }))
  }

  /**
   * Gradually applies the momentum after a pan end
   */
  applyMomentum() {
    this.setState(
      state => {
        const maxOffset = this.computeMaxOffset()

        return {
          offsetX: clamp(
            -maxOffset.x,
            state.offsetX + state.momentum.x,
            maxOffset.x
          ),
          offsetY: clamp(
            -maxOffset.y,
            state.offsetY + state.momentum.y,
            maxOffset.y
          ),
          momentum: {
            x: state.momentum.x * FRICTION,
            y: state.momentum.y * FRICTION
          }
        }
      },
      () => {
        if (
          Math.abs(this.state.momentum.x) > 0.1 ||
          Math.abs(this.state.momentum.y) > 0.1
        )
          requestAnimationFrame(this.applyMomentum.bind(this))
      }
    )
  }

  /**
   * Compute the maximum offset that can be applied to the photo on each axis before it goes over the edges
   * @returns {object} A point with an x and y property
   */
  computeMaxOffset() {
    if (this.viewer && this.photo) {
      const wrapperBoundaries = this.viewer.getBoundingClientRect()
      const photoBoundaries = this.photo.getBoundingClientRect()

      return {
        x:
          Math.max(photoBoundaries.width / 2 - wrapperBoundaries.width / 2, 0) /
          this.state.scale,
        y:
          Math.max(
            photoBoundaries.height / 2 - wrapperBoundaries.height / 2,
            0
          ) / this.state.scale
      }
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
}
