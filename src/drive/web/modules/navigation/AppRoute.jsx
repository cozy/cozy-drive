/* global __TARGET__ */
import React from 'react'
import { Route, Redirect, IndexRoute } from 'react-router'

import Settings from 'drive/mobile/modules/settings/Settings'
import OnBoarding from 'drive/mobile/modules/onboarding/OnBoarding'

import Layout from 'drive/web/modules/layout/Layout'
import FileExplorer from './FileExplorer'
import FilesViewer from 'drive/web/modules/viewer/FilesViewer'

import {
  FolderContainer as Folder,
  RecentContainer as Recent,
  FileOpenerExternal,
  SharingsContainer as Sharings
} from 'drive/web/modules/drive'
import { Container as Trash } from 'drive/web/modules/trash'

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
