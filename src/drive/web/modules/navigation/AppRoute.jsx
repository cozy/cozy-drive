/* global __TARGET__ */
import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'

import Settings from 'drive/mobile/modules/settings/Settings'
import OnBoarding from 'drive/mobile/modules/onboarding/OnBoarding'

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
import SearchView from '../views/Search/SearchView'
import OnlyOfficePaywallView from '../views/OnlyOffice/OnlyOfficePaywallView'

import FilesViewerRecent from '../views/Recent/FilesViewerRecent'

// To keep in sync with AppRoute below, used to extract params
// in the "router" redux slice. Innermost routes should be
// first
export const routes = [
  '/folder/:folderId',
  '/folder/:folderId/paywall',
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
  '/onlyoffice/:fileId/fromCreate',
  '/onlyoffice/create/:folderId/:fileClass'
]

const RootComponent = () => (
  <Layout>
    <Outlet />
  </Layout>
)

const AppRoute = () => (
  <Routes>
    <Route path="external/:fileId" element={<ExternalRedirect />} />
    <Route element={<RootComponent />}>
      {__TARGET__ === 'mobile' && (
        <Route path="uploadfrommobile" element={<UploadFromMobile />} />
      )}
      {/* <Redirect from="/files/:folderId" to="/folder/:folderId" /> */}
      <Route path="/" element={<Index />} />

      <Route path="folder" element={<DriveView />}>
        {/* For FilesViewer and FileHistory, we want 2 routes to match: `/folder/:folderId/file/:fileId` and `/folder/file/:fileId`. The `:folderId` is not present when opening a file from the root folder. */}
        <Route path=":folderId">
          <Route path="file/:fileId" element={<FilesViewerDrive />} />
          <Route path="file/:fileId/revision" element={<FileHistory />} />
          <Route path="paywall" element={<OnlyOfficePaywallView />} />
        </Route>
        <Route path="file/:fileId" element={<FilesViewerDrive />} />
        <Route path="file/:fileId/revision" element={<FileHistory />} />
      </Route>

      <Route path="recent" element={<RecentView />}>
        <Route path="file/:fileId" element={<FilesViewerRecent />} />
        <Route path="file/:fileId/revision" element={<FileHistory />} />
      </Route>

      <Route path="trash">
        <Route index element={<TrashFolderView />} />
        <Route path=":folderId" element={<TrashFolderView />}>
          <Route path="file/:fileId" element={<FilesViewerTrash />} />
          <Route path="file/:fileId/revision" element={<FileHistory />} />
        </Route>
      </Route>

      <Route path="sharings">
        <Route index element={<SharingsView />} />
        <Route element={<SharingsView />}>
          <Route path="file/:fileId" element={<SharingsFilesViewer />} />
          {/* This route must be a child of SharingsView so the modal opens on top of the sharing view */}
          <Route path="file/:fileId/revision" element={<FileHistory />} />
        </Route>
        {/* This route must be inside the /sharing path for the nav to have an activate state */}
        <Route path=":folderId" element={<SharingsFolderView />}>
          <Route path="file/:fileId" element={<SharingsFilesViewer />} />
          {/* This route must be a child of SharingsFolderView so the modal opens on top of the folder view */}
          <Route path="file/:fileId/revision" element={<FileHistory />} />
        </Route>
      </Route>
      <Route path="onlyoffice/:fileId" element={<OnlyOfficeView />}>
        <Route path="paywall" element={<OnlyOfficePaywallView />} />
      </Route>
      <Route
        path="onlyoffice/:fileId/fromCreate"
        element={<OnlyOfficeView />}
      />
      <Route
        path="onlyoffice/create/:folderId/:fileClass"
        element={<OnlyOfficeCreateView />}
      />

      {__TARGET__ === 'mobile' && (
        <Route path="settings" element={<Settings />} />
      )}
      <Route path="file/:fileId" element={<FileOpenerExternal />} />
      <Route path="search" component={<SearchView />} />
    </Route>
    {__TARGET__ === 'mobile' && (
      <Route path="onboarding" element={<OnBoarding />} />
    )}
  </Routes>
)

export default AppRoute
