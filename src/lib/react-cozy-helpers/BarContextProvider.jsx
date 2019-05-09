import React from 'react'

class BarContextProvider extends React.Component {
  getChildContext() {
    return this.props
  }

  render() {
    if (!this.props.children) return null
    if (!Array.isArray(this.props.children)) return this.props.children
    return this.props.children[0]
  }
}

export default BarContextProvider
