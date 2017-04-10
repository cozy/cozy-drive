import React from 'react'
import { Route } from 'react-router'

import AppRoute from '../../../src/components/AppRoute'
import App from '../../../src/components/App'

import { initBar } from '../lib/cozy-helper'

import OnBoarding from '../containers/OnBoarding'
import Settings from '../containers/Settings'
import RevokableWrapper from '../containers/RevokableWrapper'

const MobileAppRoute = requireSetup => (
  <Route>
    <Route onEnter={requireSetup} component={RevokableWrapper}>
      {AppRoute}
      <Route component={App}>
        <Route path='settings' name='mobile.settings' component={Settings} />}
      </Route>
    </Route>
    <Route path='onboarding' component={OnBoarding} onLeave={() => initBar()} />
  </Route>
)

export default MobileAppRoute
