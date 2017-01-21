import React from 'react'
import { Route, Redirect } from 'react-router'

import Timeline from '../containers/Timeline'

import App from './App'
const ComingSoon = () => (<p style='margin-left: 2em'>Coming soon!</p>)

const AppRoute = (
  <Route component={App}>
    <Redirect from='/' to='photos' />
    <Route path='photos' component={Timeline} />
    <Route path='albums' component={ComingSoon} />
    <Route path='shared' component={ComingSoon} />
    <Route path='trash' component={ComingSoon} />
  </Route>
)

export default AppRoute
