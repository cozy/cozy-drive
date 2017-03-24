import React from 'react'
import { Route, Redirect } from 'react-router'

import Layout from './Layout'
import FileExplorer from '../containers/FileExplorer'
import Files from '../containers/Files'
import Trash from '../containers/Trash'

const AppRoute = (
  <Route component={Layout}>
    <Route component={FileExplorer}>
      <Redirect from='/' to='files' />
      <Route path='files(/:folderId)' component={Files} />
      <Route path='trash(/:folderId)' component={Trash} />
    </Route>
  </Route>
)

export default AppRoute
