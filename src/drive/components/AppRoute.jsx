import React from 'react'
import { Route, Redirect } from 'react-router'

import Layout from './Layout'
import FileExplorer from '../containers/FileExplorer'

import {
  FolderContainer as Folder,
  RecentContainer as Recent,
  FileOpener
} from '../ducks/files'
import { Container as Trash } from '../ducks/trash'

const AppRoute = (
  <Route component={Layout}>
    <Redirect from="/files/:folderId" to="/folder/:folderId" />
    <Route component={FileExplorer}>
      <Redirect from="/" to="folder" />
      <Route path="folder(/:folderId)" component={Folder} />
      <Route path="recent" component={Recent} />
      <Route path="trash(/:folderId)" component={Trash} />
    </Route>
    <Route path="file/:fileId" component={FileOpener} />
  </Route>
)

export default AppRoute
