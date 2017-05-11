/* global cozy */

import React from 'react'
import { render } from 'react-dom'

document.addEventListener('DOMContentLoaded', init)

class App extends React.Component {
  render () {
    return (
      <h1>Photos</h1>
    )
  }
}

function init () {
  const root = document.querySelector('[role=application]')
  const data = root.dataset

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
