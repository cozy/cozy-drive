/* global __TARGET__ */
import React from 'react'
import { Route, Redirect, IndexRoute } from 'react-router'

import Settings from 'drive/mobile/ducks/settings/Settings'
import OnBoarding from 'drive/mobile/ducks/onboarding/OnBoarding'

import Layout from './Layout'
import FileExplorer from '../containers/FileExplorer'
import FilesViewer from './FilesViewer'

import {
  FolderContainer as Folder,
  RecentContainer as Recent,
  FileOpenerExternal,
  SharingsContainer as Sharings
} from '../ducks/files'
import { Container as Trash } from '../ducks/trash'

const AppRoute = (
  <Route>
    <Route component={Layout}>
      <Redirect from="/files/:folderId" to="/folder/:folderId" />
      <Route component={FileExplorer}>
        <Redirect from="/" to="folder" />
        <Route path="folder" component={Folder}>
          <Route path=":folderId">
            <Route path="file/:fileId" component={FilesViewer} />
          </Route>
          <Route path="file/:fileId" component={FilesViewer} />
        </Route>
        <Route path="recent" component={Recent}>
          <Route path="file/:fileId" component={FilesViewer} />
        </Route>
        <Route path="sharings">
          <IndexRoute component={Sharings} />
          <Route path=":folderId" component={Folder}>
            <Route path="file/:fileId" component={FilesViewer} />
          </Route>
          <Route path="file/:fileId" component={FilesViewer} />
        </Route>
        <Route path="trash" component={Trash}>
          <Route path=":folderId">
            <Route path="file/:fileId" component={FilesViewer} />
          </Route>
          <Route path="file/:fileId" component={FilesViewer} />
        </Route>
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
