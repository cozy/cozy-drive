import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Hammer from 'hammerjs'

const shouldListenToSwipe = handlers => Object.keys(handlers).find(h => /^swipe/.test(h)) !== undefined
const shouldListenToPan = handlers => Object.keys(handlers).find(h => /^pan/.test(h)) !== undefined
const shouldListenToTap = handlers => Object.keys(handlers).find(h => /^tap/.test(h)) !== undefined

const GHOST_CLICK_DELAY = 350

const withGestures = (eventHandlers) => {
  return WrappedComponent => {
    return class WithGesturesComponent extends Component {
      componentDidMount () {
        const node = ReactDOM.findDOMNode(this)
        this.hammer = new Hammer.Manager(node, {
          recognizers: [[Hammer.Tap], [Hammer.Swipe, { direction: Hammer.DIRECTION_ALL }], [Hammer.Pan, { direction: Hammer.DIRECTION_ALL }]]
        })
        this.handlers = eventHandlers.call(this.wrappedComponentInstance, this.props)
        if (shouldListenToSwipe(this.handlers)) {
          this.hammer.on('swipe', e => this.onSwipe(e))
        }
        if (shouldListenToPan(this.handlers)) {
          this.hammer.on('pan', e => this.onPan(e))
          this.hammer.on('panstart', e => this.onPan(e))
          this.hammer.on('panend', e => this.onPan(e))
        }
        if (shouldListenToTap(this.handlers)) {
          // when listening for taps, we need to debounce the ghost click that happens right afterwards
          let lastTouchEvent = null
          let ghostClickTimeout = null
          this.hammer.on('tap', e => {
            lastTouchEvent = e
            // if nothing happens in the next couple of ms, we fire the tap event
            ghostClickTimeout = setTimeout(() => {
              this.onTap(e)
              ghostClickTimeout = lastTouchEvent = null
            }, GHOST_CLICK_DELAY)
          })
          node.addEventListener('click', e => {
            // when a click event happens, we check to see if it's related to the last touch event we received
            if (ghostClickTimeout !== null &&
                lastTouchEvent !== null &&
                Math.round(lastTouchEvent.srcEvent.pageX) === Math.round(e.pageX) &&
                Math.round(lastTouchEvent.srcEvent.pageY) === Math.round(e.pageY)) {
              // the 2 events are related, so we can fire the tap event
              e.preventDefault()
              e.stopPropagation()
              clearTimeout(ghostClickTimeout)
              this.onTap(lastTouchEvent)
              ghostClickTimeout = lastTouchEvent = null
            }
          })
        }
      }

      componentWillUnmount () {
        this.hammer.destroy()
      }

      onSwipe (e) {
        if (e.direction === Hammer.DIRECTION_LEFT && this.handlers.swipeLeft) this.handlers.swipeLeft(e)
        if (e.direction === Hammer.DIRECTION_RIGHT && this.handlers.swipeRight) this.handlers.swipeRight(e)
        if (e.direction === Hammer.DIRECTION_UP && this.handlers.swipeUp) this.handlers.swipeUp(e)
        if (e.direction === Hammer.DIRECTION_DOWN && this.handlers.swipeDown) this.handlers.swipeDown(e)
      }

      onPan (e) {
        if (e.type === 'pan') {
          if (e.direction === Hammer.DIRECTION_LEFT && this.handlers.panLeft) this.handlers.panLeft(e)
          if (e.direction === Hammer.DIRECTION_RIGHT && this.handlers.panRight) this.handlers.panRight(e)
          if (e.direction === Hammer.DIRECTION_UP && this.handlers.panUp) this.handlers.panUp(e)
          if (e.direction === Hammer.DIRECTION_DOWN && this.handlers.panDown) this.handlers.panDown(e)
        } else if (e.type === 'panstart' && this.handlers.panStart) {
          this.handlers.panStart(e)
        } else if (e.type === 'panend' && this.handlers.panEnd) {
          this.handlers.panEnd(e)
        }
      }

      onTap (e) {
        this.handlers.tap(e)
      }

      render () {
        return (
          <WrappedComponent {...this.props} ref={wrapped => { this.wrappedComponentInstance = wrapped }} />
        )
      }
    }
  }
}

export default withGestures
