import React from 'react'
import { Route } from 'react-router'

import AppRoute from '../../components/AppRoute'
import Layout from '../../components/Layout'

import { initBar } from '../lib/cozy-helper'

import OnBoarding from '../containers/OnBoarding'
import Settings from '../components/Settings'
import RevokableWrapper from '../containers/RevokableWrapper'

const MobileAppRoute = checkAuth => (
  <Route>
    <Route onEnter={checkAuth} component={RevokableWrapper}>
      {AppRoute}
      <Route component={Layout}>
        <Route path="settings" name="mobile.settings" component={Settings} />}
      </Route>
    </Route>
    <Route path="onboarding" component={OnBoarding} onLeave={() => initBar()} />
  </Route>
)

export default MobileAppRoute
