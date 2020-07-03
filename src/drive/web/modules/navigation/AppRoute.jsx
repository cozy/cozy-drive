/* global __TARGET__ */
import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import flag from 'cozy-flags'

import Settings from 'drive/mobile/modules/settings/Settings'
import OnBoarding from 'drive/mobile/modules/onboarding/OnBoarding'

import { RouterContextProvider } from 'drive/lib/RouterContext'
import Layout from 'drive/web/modules/layout/Layout'
import FileExplorer from './FileExplorer'
import FileOpenerExternal from 'drive/web/modules/viewer/FileOpenerExternal'
import {
  FolderContainer as Folder,
  RecentContainer as Recent
} from 'drive/web/modules/drive'
import { Container as LegacyTrash } from 'drive/web/modules/trash'
import FileHistory from '../../../../components/FileHistory'
import UploadFromMobile from 'drive/mobile/modules/upload'

import ExternalRedirect from './ExternalRedirect'
import DriveView from '../views/Drive'
import FilesViewerDrive from '../views/Drive/FilesViewerDrive'
import RecentView from '../views/Recent'
import FilesViewerTrash from '../views/Trash/FilesViewerTrash'
import TrashFolderView from '../views/Trash/TrashFolderView'
import SharingsView from '../views/Sharings'
import SharingsFilesViewer from '../views/Sharings/FilesViewerSharings'
import SharingsFolderView from '../views/Sharings/SharingsFolderView'

import FilesViewerRecent from '../views/Recent/FilesViewerRecent'
// To keep in sync with AppRoute below, used to extract params
// in the "router" redux slice. Innermost routes should be
// first
export const routes = [
  '/folder/:folderId/file/:fileId',
  '/files/:folderId/file/:fileId',
  '/files/:folderId',
  '/folder/:folderId',
  '/recent/file/:fileId',
  '/sharings/:folderId/file/:fileId',
  '/sharings/file/:fileId',
  '/sharings/:folderId',
  '/trash/:folderId/file/:fileId',
  '/trash/:folderId'
]

const LegacyDriveView = routerProps => (
  <FileExplorer {...routerProps}>
    <Folder {...routerProps} />
  </FileExplorer>
)

const LegacyRecentView = routerProps => (
  <FileExplorer {...routerProps}>
    <Recent {...routerProps} />
  </FileExplorer>
)

const RootComponent = routerProps => (
  <Layout>
    <RouterContextProvider {...routerProps} />
  </Layout>
)

const AppRoute = (
  <Route>
    <Route path="external/:fileId" component={ExternalRedirect} />
    <Route component={RootComponent}>
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
          <Route path="file/:fileId" component={FilesViewerDrive} />
          <Route path="file/:fileId/revision" component={FileHistory} />
        </Route>
        <Route path="file/:fileId" component={FilesViewerDrive} />
        <Route path="file/:fileId/revision" component={FileHistory} />
      </Route>

      <Route
        path="recent"
        component={
          flag('drive.client-migration.enabled') ? RecentView : LegacyRecentView
        }
      >
        <Route path="file/:fileId" component={FilesViewerRecent} />
        <Route path="file/:fileId/revision" component={FileHistory} />
      </Route>

      <Route path="trash">
        <IndexRoute
          component={
            flag('drive.client-migration.enabled')
              ? TrashFolderView
              : LegacyTrash
          }
        />
        <Route path=":folderId" component={TrashFolderView}>
          <Route path="file/:fileId" component={FilesViewerTrash} />
        </Route>
      </Route>

      <Route path="sharings">
        <IndexRoute component={SharingsView} />
        <Route path=":folderId" component={SharingsFolderView}>
          <Route path="file/:fileId" component={SharingsFilesViewer} />
        </Route>
        <Route path="file/:fileId" component={SharingsFilesViewer} />
      </Route>

      <Route component={FileExplorer}>
        <Redirect from="/" to="folder" />
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
