import React, { Component } from 'react'
import Hammer from '@egjs/hammerjs'
import propagating from 'propagating-hammerjs'

import styles from './fileopener.styl'

/**
 * This component is necessary if you want to use an onClick
 * and stop its propagation when you are down the tree of
 * a component that already * has a GestureHandler managed by Hammer.
 * It is impossible to tell Hammer to ignore the event.
 * The only way is to use Hammer also for the onClick and to use a lib
 * that wrap Hammer in order to have access to a stopPropagation that works.
 *
 * Hammer is used on the File to manage the longPress to display the selection.
 */
class HammerComponent extends Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }
  componentDidMount() {
    this.gesturesHandler = propagating(new Hammer(this.myRef.current))
    this.gesturesHandler.on('tap', ev => {
      this.props.onClick()
      ev.stopPropagation()
    })
  }
  render() {
    return (
      <span className={styles['file-opener']} ref={this.myRef}>
        {this.props.children}
      </span>
    )
  }
}

export default HammerComponent
