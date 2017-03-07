import React from 'react'
import { Route, Redirect } from 'react-router'

import App from './App'
import Folder from '../containers/Folder'

const AppRoute = (
  <Route component={App}>
    <Redirect from='/' to='files' />
    <Route path='files(/:folderId)' component={props => <Folder context='files' {...props} />} />
    <Route path='trash(/:folderId)' component={props => <Folder context='trash' {...props} />} />
  </Route>
)

export default AppRoute
