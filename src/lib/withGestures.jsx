import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Hammer from 'hammerjs'

const shouldListenToSwipe = handlers => Object.keys(handlers).find(h => /^swipe/.test(h)) !== undefined
const shouldListenToTap = handlers => Object.keys(handlers).find(h => /^tap/.test(h)) !== undefined

const withGestures = (eventHandlers) => {
  return WrappedComponent => {
    return class WithGesturesComponent extends Component {
      componentDidMount () {
        this.hammer = new Hammer(ReactDOM.findDOMNode(this))
        this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL })
        this.handlers = eventHandlers(this.props)
        if (shouldListenToSwipe(this.handlers)) {
          this.hammer.on('swipe', e => this.onSwipe(e))
        }
        if (shouldListenToTap(this.handlers)) {
          this.hammer.on('tap', e => this.onTap(e))
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

      onTap (e) {
        this.handlers.tap(e)
      }

      render () {
        return (
          <WrappedComponent {...this.props} />
        )
      }
    }
  }
}

export default withGestures
