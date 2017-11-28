import React, { Component } from 'react'
import Hammer from 'hammerjs'

const withSwipe = WrappedComponent => {
  return class Wrapper extends Component {
    componentDidMount() {
      this.gesturesHandler = new Hammer(React.findDOMNode(this.wrapped))
      this.gesturesHandler.on('swipe', this.onSwipe)
    }

    onSwipe = e => {
      console.log(e)
      if (e.direction === Hammer.DIRECTION_LEFT && this.props.onSwipeLeft)
        this.props.onSwipeLeft()
      else if (
        e.direction === Hammer.DIRECTION_RIGHT &&
        this.props.onSwipeRight
      )
        this.props.onSwipeRight()
    }

    render() {
      return (
        <WrappedComponent
          ref={wrapped => {
            this.wrapped = wrapped
          }}
          {...this.props}
        />
      )
    }
  }
}

export default withSwipe
