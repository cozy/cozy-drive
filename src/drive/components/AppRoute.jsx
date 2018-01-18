/* global __TARGET__ */
import React from 'react'
import { Route, Redirect } from 'react-router'

import Layout from './Layout'
import FileExplorer from '../containers/FileExplorer'
import Settings from '../mobile/components/Settings'
import OnBoarding from '../mobile/containers/OnBoarding'
import FilesViewer from './FilesViewer'

import {
  FolderContainer as Folder,
  RecentContainer as Recent,
  FileOpenerExternal
} from '../ducks/files'
import { Container as Trash } from '../ducks/trash'

const AppRoute = (
  <Route>
    <Route component={Layout}>
      <Redirect from="/files/:folderId" to="/folder/:folderId" />
      <Route component={FileExplorer}>
        <Redirect from="/" to="folder" />
        <Route path="folder" component={Folder}>
          <Route path="file/:fileId" component={FilesViewer} />
        </Route>
        <Route path="folder/:folderId" component={Folder}>
          <Route path="file/:fileId" component={FilesViewer} />
        </Route>
        <Route path="recent" component={Recent} />
        <Route path="trash(/:folderId)" component={Trash} />
      </Route>
      {__TARGET__ === 'mobile' && (
        <Route path="settings" component={Settings} />
      )}
      <Route path="file/:fileId" component={FileOpenerExternal} />
    </Route>
    {__TARGET__ === 'mobile' && (
      <Route path="onboarding" component={OnBoarding} />
    )}
  </Route>
)

export default AppRoute
