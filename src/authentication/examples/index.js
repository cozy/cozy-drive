import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { DumbAuthentication, DumbRevoked } from '../build'
import 'date-fns/locale/en/index'
import 'cozy-ui/transpiled/stylesheet.css'

const styles = {
  Container: {
    display: 'flex'
  },

  Nav: {
    flexBasis: '20%'
  }
}

class WithLang extends React.Component {
  render() {
    return this.props.children
  }

  getChildContext() {
    return {
      lang: this.props.lang,
      t: x => x,
      store: {
        getState: () => {},
        subscribe: () => {}
      }
    }
  }
}

WithLang.childContextTypes = {
  lang: PropTypes.string,
  t: PropTypes.func,
  store: PropTypes.object
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'authentication'
    }
  }

  handleClick(view) {
    this.setState({ view })
  }
  render() {
    return (
      <div style={styles.Container}>
        <div style={styles.Nav}>
          <button onClick={this.handleClick.bind(this, 'authentication')}>
            Authentication
          </button>
          <button onClick={this.handleClick.bind(this, 'revoked')}>
            Revoked
          </button>
        </div>
        <div style={styles.View}>
          <WithLang lang="en">
            {this.state.view == 'authentication' ? (
              <DumbAuthentication lang="en" />
            ) : (
              <DumbRevoked lang="en" />
            )}
          </WithLang>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'))
