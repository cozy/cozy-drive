/* global cozy */

import React from 'react'

import PublicAlbumView from './PublicAlbumView'

const arrToObj = (obj = {}, varval = ['var', 'val']) => {
  obj[varval[0]] = varval[1]
  return obj
}

const getQueryParameter = () => window
  .location
  .search
  .substring(1)
  .split('&')
  .map(varval => varval.split('='))
  .reduce(arrToObj, {})

class App extends React.Component {
  componentDidMount () {
    const { data } = this.props
    const { id } = getQueryParameter()

    if (data.cozyDomain && data.cozyToken) {
      cozy.client.init({
        cozyURL: `//${data.cozyDomain}`,
        token: data.cozyToken
      })
    }

    if (data.cozyAppName && data.cozyAppEditor && data.cozyIconPath && data.cozyLocale) {
      try {
        cozy.bar.init({
          appName: data.cozyAppName,
          appEditor: data.cozyAppEditor,
          iconPath: data.cozyIconPath,
          lang: data.cozyLocale
        })
      } catch (ex) {
        this.setState(state => ({ ...state, error: ex }))
      }
    }

    if (!id) {
      this.setState(state => ({ ...state, error: 'Missing ID' }))
    }

    this.setState(state => ({ ...state, id }))
  }

  render () {
    return this.state.error
      ? <h1>Error</h1>
      : this.state.id
        ? <PublicAlbumView id={this.state.id} />
        : <h1>Loading...</h1>
  }
}

export default App
