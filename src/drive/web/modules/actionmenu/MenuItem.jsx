import React, { Component } from 'react'

export default class MenuItem extends Component {
  onClick = e => {
    // we need to stop propagation here so that the menu doesn't close itself
    e.stopPropagation()
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render() {
    const { className, children } = this.props
    return (
      <div>
        <a className={className} onClick={this.onClick}>
          {children}
        </a>
      </div>
    )
  }
}
