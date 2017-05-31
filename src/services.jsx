 /* global __DEVELOPMENT__ */
/* global cozy */

import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

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


document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset

  cozy.client.init({
    cozyURL: '//' + data.cozyDomain,
    token: data.cozyToken
  })

  const { intent } = getQueryParameter()

  console.log(cozy.client)

  cozy.client.intents.createService(intent, window)
  .then(service => {
    const { id } = service.getData()
    cozy.client.files.getDownloadLinkById(id)
    .then(link => `${cozy.client._url}${link}`)
    .then(url => render(<embed src={url} width='800px' />, root))
  })
})
