import { Component } from 'react'
import PropTypes from 'prop-types'

export default class CozyProvider extends Component {
  static propTypes = {
    store: PropTypes.shape({
      subscribe: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      getState: PropTypes.func.isRequired
    }),
    client: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  }

  static childContextTypes = {
    store: PropTypes.object,
    client: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object
  }

  getChildContext() {
    return {
      store: this.props.store || this.context.store,
      client: this.props.client
    }
  }

  render() {
    return (this.props.children && this.props.children[0]) || null
  }
}
