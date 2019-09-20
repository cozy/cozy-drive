/* global __TARGET__ */
import React from 'react'
import { Route, Redirect } from 'react-router'

import Settings from 'drive/mobile/modules/settings/Settings'
import SelectMediaBuckets from 'drive/mobile/modules/settings/components/SelectMediaBuckets'
import OnBoarding from 'drive/mobile/modules/onboarding/OnBoarding'

import Layout from 'drive/web/modules/layout/Layout'
import FileExplorer from './FileExplorer'
import FilesViewer from 'drive/web/modules/viewer/FilesViewer'
import FileOpenerExternal from 'drive/web/modules/viewer/FileOpenerExternal'

import {
  FolderContainer as Folder,
  RecentContainer as Recent,
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
        <Route path="sharings" component={Sharings}>
          <Route path=":folderId">
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
      {__TARGET__ === 'mobile' && (
        <Route path="/selectMediaBuckets" component={SelectMediaBuckets} />
      )}
      <Route path="file/:fileId" component={FileOpenerExternal} />
    </Route>
    {__TARGET__ === 'mobile' && (
      <Route path="onboarding" component={OnBoarding} />
    )}
  </Route>
)

export default AppRoute
