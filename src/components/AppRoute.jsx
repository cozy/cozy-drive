import React from 'react'
import { Route, Redirect } from 'react-router'

import App from './App'
import FileExplorer from '../containers/FileExplorer'

const AppRoute = (
  <Route component={App}>
    <Redirect from='/' to='files' />
    <Route path='files(/:folderId)' component={FileExplorer} />
    <Route path='trash(/:folderId)' component={FileExplorer} />
  </Route>
)

export default AppRoute
