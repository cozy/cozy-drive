import React from 'react'
import { Route, Redirect, hashHistory } from 'react-router'

import App from './App'
import Folder from '../containers/Folder'
const ComingSoon = () => (<p style='margin-left: 2em'>Coming soon!</p>)

const AppRoute = (
  <Route component={App} history={hashHistory}>
    <Redirect from='/' to='files' />
    <Route path='files(/:file)' component={Folder} />
    <Route path='recent' component={ComingSoon} />
    <Route path='shared' component={ComingSoon} />
    <Route path='activity' component={ComingSoon} />
    <Route path='trash' component={ComingSoon} />
  </Route>
)

export default AppRoute
