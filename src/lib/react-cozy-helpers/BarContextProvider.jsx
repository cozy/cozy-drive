import React from 'react'
import PropTypes from 'prop-types'

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
BarContextProvider.childContextTypes = {
  //child context keys
  client: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  children: PropTypes.object
}
export default BarContextProvider
