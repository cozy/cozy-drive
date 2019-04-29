import 'cozy-ui/transpiled/react/stylesheet.css'
import mainStyles from 'drive/styles/main.styl'
import mobileStyles from 'drive/styles/mobile.styl'


import 'whatwg-fetch'
import React from 'react'
import { hashHistory } from 'react-router'

import { handleDeeplink } from 'drive/mobile/lib/handleDeepLink'
import InitAppMobile from './InitAppMobile'

const app = new InitAppMobile()
const appBooted = app.initialize()
window.handleOpenURL = async url => {
  await appBooted
  const store = await app.getStore()
  handleDeeplink(hashHistory, store, url)
}

