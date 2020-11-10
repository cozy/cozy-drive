import React, { Component } from 'React'
import Hammer from '@egjs/hammerjs'
import propagating from 'propagating-hammerjs'
import styles from './fileopener.styl'

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
