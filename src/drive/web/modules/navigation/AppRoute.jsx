/* global __TARGET__ */
import React from 'react'
import { Route, Redirect } from 'react-router'
import flag from 'cozy-flags'

import Settings from 'drive/mobile/modules/settings/Settings'
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
import FileHistory from '../../../../components/FileHistory'
import UploadFromMobile from 'drive/mobile/modules/upload'

import ExternalRedirect from './ExternalRedirect'
import DriveView from '../views/Drive'

const LegacyDriveView = routerProps => (
  <FileExplorer {...routerProps}>
    <Folder {...routerProps} />
  </FileExplorer>
)

const AppRoute = (
  <Route>
    <Route path="external/:fileId" component={ExternalRedirect} />
    <Route component={Layout}>
      {__TARGET__ === 'mobile' && (
        <Route path="uploadfrommobile" component={UploadFromMobile} />
      )}
      <Redirect from="/files/:folderId" to="/folder/:folderId" />

      <Route
        path="folder"
        component={
          flag('drive.client-migration.enabled') ? DriveView : LegacyDriveView
        }
      >
        {/* For FilesViewer and FileHistory, we want 2 routes to match: `/folder/:folderId/file/:fileId` and `/folder/file/:fileId`. The `:folderId` is not present when opening a file from the root folder. */}
        <Route path=":folderId">
          <Route path="file/:fileId" component={FilesViewer} />
          <Route path="file/:fileId/revision" component={FileHistory} />
        </Route>
        <Route path="file/:fileId" component={FilesViewer} />
        <Route path="file/:fileId/revision" component={FileHistory} />
      </Route>

      <Route component={FileExplorer}>
        <Redirect from="/" to="folder" />
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
      <Route path="file/:fileId" component={FileOpenerExternal} />
    </Route>
    {__TARGET__ === 'mobile' && (
      <Route path="onboarding" component={OnBoarding} />
    )}
  </Route>
)

export default AppRoute
