/* global __TARGET__ */
import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import Settings from 'drive/mobile/modules/settings/Settings'
import OnBoarding from 'drive/mobile/modules/onboarding/OnBoarding'

import { RouterContextProvider } from 'drive/lib/RouterContext'
import Layout from 'drive/web/modules/layout/Layout'
import FileOpenerExternal from 'drive/web/modules/viewer/FileOpenerExternal'
import FileHistory from 'components/FileHistory'
import UploadFromMobile from 'drive/mobile/modules/upload'

import ExternalRedirect from './ExternalRedirect'
import Index from './Index'
import DriveView from '../views/Drive'
import FilesViewerDrive from '../views/Drive/FilesViewerDrive'
import RecentView from '../views/Recent'
import FilesViewerTrash from '../views/Trash/FilesViewerTrash'
import TrashFolderView from '../views/Trash/TrashFolderView'
import SharingsView from '../views/Sharings'
import SharingsFilesViewer from '../views/Sharings/FilesViewerSharings'
import SharingsFolderView from '../views/Sharings/SharingsFolderView'
import OnlyOfficeView from '../views/OnlyOffice'
import OnlyOfficeCreateView from '../views/OnlyOffice/Create'

import FilesViewerRecent from '../views/Recent/FilesViewerRecent'
// To keep in sync with AppRoute below, used to extract params
// in the "router" redux slice. Innermost routes should be
// first
export const routes = [
  '/folder/:folderId',
  '/folder/:folderId/file/:fileId',
  '/folder/:folderId/file/:fileId/revision',
  '/recent/file/:fileId',
  '/recent/file/:fileId/revision',
  '/sharings/:folderId',
  '/sharings/:folderId/file/:fileId',
  '/sharings/:folderId/file/:fileId/revision',
  '/sharings/file/:fileId',
  '/sharings/file/:fileId/revision',
  '/trash/:folderId/file/:fileId',
  '/trash/:folderId',
  '/file/:fileId',
  '/onlyoffice/:fileId',
  '/onlyoffice/:fileId/fromSharing',
  '/onlyoffice/:fileId/fromCreate',
  '/onlyoffice/create/:folderId/:fileClass'
]

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
      <Route path="/" component={Index} />

      <Route path="folder" component={DriveView}>
        {/* For FilesViewer and FileHistory, we want 2 routes to match: `/folder/:folderId/file/:fileId` and `/folder/file/:fileId`. The `:folderId` is not present when opening a file from the root folder. */}
        <Route path=":folderId">
          <Route path="file/:fileId" component={FilesViewerDrive} />
          <Route path="file/:fileId/revision" component={FileHistory} />
        </Route>
        <Route path="file/:fileId" component={FilesViewerDrive} />
        <Route path="file/:fileId/revision" component={FileHistory} />
      </Route>

      <Route path="recent" component={RecentView}>
        <Route path="file/:fileId" component={FilesViewerRecent} />
        <Route path="file/:fileId/revision" component={FileHistory} />
      </Route>

      <Route path="trash">
        <IndexRoute component={TrashFolderView} />
        <Route path=":folderId" component={TrashFolderView}>
          <Route path="file/:fileId" component={FilesViewerTrash} />
          <Route path="file/:fileId/revision" component={FileHistory} />
        </Route>
      </Route>

      <Route path="sharings">
        <IndexRoute component={SharingsView} />
        <Route component={SharingsView}>
          <Route path="file/:fileId" component={SharingsFilesViewer} />
          {/* This route must be a child of SharingsView so the modal opens on top of the sharing view */}
          <Route path="file/:fileId/revision" component={FileHistory} />
        </Route>
        {/* This route must be inside the /sharing path for the nav to have an activate state */}
        <Route path=":folderId" component={SharingsFolderView}>
          <Route path="file/:fileId" component={SharingsFilesViewer} />
          {/* This route must be a child of SharingsFolderView so the modal opens on top of the folder view */}
          <Route path="file/:fileId/revision" component={FileHistory} />
        </Route>
      </Route>

      <Route path="onlyoffice/:fileId" component={OnlyOfficeView} />
      <Route path="onlyoffice/:fileId/fromSharing" component={OnlyOfficeView} />
      <Route path="onlyoffice/:fileId/fromCreate" component={OnlyOfficeView} />
      <Route
        path="onlyoffice/create/:folderId/:fileClass"
        component={OnlyOfficeCreateView}
      />

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
