/* global cozy */

import React from 'react'
import { render } from 'react-dom'

document.addEventListener('DOMContentLoaded', init)

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = []
  }

  addAll (photos) {
    this.setState(state => state.concat(photos))
  }

  componentDidMount () {
    const album = {
      _type: 'io.cozy.photos.albums',
      _id: 'f6f96990b5af9be2b04ca9f832000c5f'
    }

    cozy.client.data.listReferencedFiles(album)
    .then(photosIds => Promise.all(photosIds.map(cozy.client.files.statById)))
    .then(this.addAll.bind(this))
  }

  render () {
    return (
      <div>
        <h1>Photos</h1>
        <ul>
          {this.state.map(photo => <li><span>{photo._id}</span></li>)}
        </ul>
      </div>
    )
  }
}

function init () {
  const root = document.querySelector('[role=application]')
  const data = root.dataset

  cozy.client.init({
    cozyURL: `//${data.cozyDomain}`,
    token: data.cozyToken
  })

  try {
    cozy.bar.init({
      appName: data.cozyAppName,
      appEditor: data.cozyAppEditor,
      iconPath: data.cozyIconPath,
      lang: data.cozyLocale
    })
  } catch (ex) {
    console.error(ex)
  }

  render(<App />, root)
}
