/* global __DEVELOPMENT__ */

import 'drive/styles/main'
import 'drive/styles/mobile'

import 'whatwg-fetch'
import React from 'react'
import { hashHistory } from 'react-router'

import { handleDeeplink } from 'drive/mobile/lib/handleDeepLink'
import InitAppMobile from './InitAppMobile'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  //require('preact/devtools')
}

const app = new InitAppMobile()
const appBooted = app.initialize()
window.handleOpenURL = async url => {
  await appBooted
  const store = await app.getStore()
  handleDeeplink(hashHistory, store, url)
}
