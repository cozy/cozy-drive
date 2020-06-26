/* global __TARGET__ */
import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import flag from 'cozy-flags'

import Settings from 'drive/mobile/modules/settings/Settings'
import OnBoarding from 'drive/mobile/modules/onboarding/OnBoarding'

import { RouterContextProvider } from 'drive/lib/RouterContext'
import Layout from 'drive/web/modules/layout/Layout'
import FileExplorer from './FileExplorer'
import FilesViewerV1 from 'drive/web/modules/viewer/FilesViewer'
import FileOpenerExternal from 'drive/web/modules/viewer/FileOpenerExternal'
import {
  FolderContainer as Folder,
  RecentContainer as Recent,
  SharingsContainer as Sharings
} from 'drive/web/modules/drive'
import { Container as LegacyTrash } from 'drive/web/modules/trash'
import FileHistory from '../../../../components/FileHistory'
import UploadFromMobile from 'drive/mobile/modules/upload'

import ExternalRedirect from './ExternalRedirect'
import DriveView from '../views/Drive'
import FilesViewerDrive from '../views/Drive/FilesViewerDrive'
import RecentView from '../views/Recent'
import TrashView from '../views/Trash'
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
  '/trash/:folderId',
  '/trash/file/:fileId',
  '/sharings/:folderId',
  '/sharings/file/:fileId'
]

const FilesViewer = flag('drive.client-migration.enabled')
  ? FilesViewerDrive
  : FilesViewerV1

const RecentFilesViewer = flag('drive.client-migration.enabled')
  ? FilesViewerRecent
  : FilesViewerV1

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

const LegacySharingsView = routerProps => (
  <FileExplorer {...routerProps}>
    <Sharings {...routerProps} />
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
          <Route path="file/:fileId" component={FilesViewer} />
          <Route path="file/:fileId/revision" component={FileHistory} />
        </Route>
        <Route path="file/:fileId" component={FilesViewer} />
        <Route path="file/:fileId/revision" component={FileHistory} />
      </Route>

      <Route
        path="recent"
        component={
          flag('drive.client-migration.enabled') ? RecentView : LegacyRecentView
        }
      >
        <Route path="file/:fileId" component={RecentFilesViewer} />
        <Route path="file/:fileId/revision" component={FileHistory} />
      </Route>

      <Route path="trash">
        <IndexRoute
          component={
            flag('drive.client-migration.enabled') ? TrashView : LegacyTrash
          }
        />
        <Route path="file/:fileId" component={FilesViewer} />
        <Route path=":folderId" component={TrashFolderView} />
      </Route>

      <Route path="sharings">
        <IndexRoute
          component={
            flag('drive.client-migration.enabled')
              ? SharingsView
              : LegacySharingsView
          }
        />
        <Route path="file/:fileId" component={SharingsFilesViewer} />
        <Route path=":folderId" component={SharingsFolderView} />
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
