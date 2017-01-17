import 'babel-polyfill'

import './styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Router, hashHistory } from 'react-router'
import { I18n } from './lib/I18n'

import AppRoute from './components/AppRoute'

const context = window.context
const lang = document.documentElement.getAttribute('lang') || 'en'

document.addEventListener('DOMContentLoaded', () => {
  render((
    <I18n context={context} lang={lang}>
      <Router history={hashHistory} routes={AppRoute} />
    </I18n>
  ), document.querySelector('[role=application]'))
})
