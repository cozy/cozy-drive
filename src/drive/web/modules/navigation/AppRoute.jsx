/* global __TARGET__ */
import React from 'react'
import { Routes, Route, useParams, Navigate } from 'react-router-dom'

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
import { ShareDisplayedFolderView } from 'drive/web/modules/views/Modal/ShareDisplayedFolderView'
import { ShareFileView } from 'drive/web/modules/views/Modal/ShareFileView'
import { QualifyFileView } from 'drive/web/modules/views/Modal/QualifyFileView'
import { MoveFilesView } from 'drive/web/modules/views/Modal/MoveFilesView'
import { UploaderComponent } from 'drive/web/modules//views/Upload/UploaderComponent'
import HarvestRoutes from 'drive/web/modules/views/Drive/HarvestRoutes'
const FilesRedirect = () => {
  const { folderId } = useParams()
  return <Navigate to={`/folder/${folderId}`} replace={true} />
}

const AppRoute = () => (
  <Routes>
    <Route path="external/:fileId" element={<ExternalRedirect />} />
    <Route element={<Layout />}>
      {__TARGET__ === 'mobile' && (
        <Route path="uploadfrommobile" element={<UploadFromMobile />} />
      )}
      <Route path="upload" element={<UploaderComponent />} />
      <Route path="/files/:folderId" element={<FilesRedirect />} />
      <Route path="/" element={<Index />} />

      <Route path="folder">
        <Route index element={<DriveView />} />
        <Route path=":folderId" element={<DriveView />}>
          <Route path="file/:fileId" element={<FilesViewerDrive />} />
          <Route path="file/:fileId/revision" element={<FileHistory />} />
          <Route path="file/:fileId/share" element={<ShareFileView />} />
          <Route path="file/:fileId/qualify" element={<QualifyFileView />} />
          <Route path="paywall" element={<OnlyOfficePaywallView />} />
          <Route path="share" element={<ShareDisplayedFolderView />} />
          <Route path="move" element={<MoveFilesView />} />
          <Route path="harvest/:konnectorSlug/*" element={<HarvestRoutes />} />
        </Route>
      </Route>

      <Route path="recent" element={<RecentView />}>
        <Route path="file/:fileId" element={<FilesViewerRecent />} />
        <Route path="file/:fileId/revision" element={<FileHistory />} />
        <Route path="file/:fileId/share" element={<ShareFileView />} />
        <Route path="file/:fileId/qualify" element={<QualifyFileView />} />
        <Route path="share" element={<ShareDisplayedFolderView />} />
        <Route path="move" element={<MoveFilesView />} />
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
          <Route path="file/:fileId/share" element={<ShareFileView />} />
          <Route path="file/:fileId/qualify" element={<QualifyFileView />} />
          <Route path="move" element={<MoveFilesView />} />
        </Route>
        {/* This route must be inside the /sharing path for the nav to have an activate state */}
        <Route path=":folderId" element={<SharingsFolderView />}>
          <Route path="file/:fileId" element={<SharingsFilesViewer />} />
          {/* This route must be a child of SharingsFolderView so the modal opens on top of the folder view */}
          <Route path="file/:fileId/revision" element={<FileHistory />} />
          <Route path="file/:fileId/share" element={<ShareFileView />} />
          <Route path="file/:fileId/qualify" element={<QualifyFileView />} />
          <Route path="share" element={<ShareDisplayedFolderView />} />
          <Route path="move" element={<MoveFilesView />} />
        </Route>
      </Route>
      <Route path="onlyoffice/:fileId" element={<OnlyOfficeView />}>
        <Route path="paywall" element={<OnlyOfficePaywallView />} />
      </Route>
      <Route
        path="onlyoffice/create/:folderId/:fileClass"
        element={<OnlyOfficeCreateView />}
      />

      {__TARGET__ === 'mobile' && (
        <Route path="settings" element={<Settings />} />
      )}
      <Route path="file/:fileId" element={<FileOpenerExternal />} />
      <Route path="search" element={<SearchView />} />
    </Route>
    {__TARGET__ === 'mobile' && (
      <Route path="onboarding" element={<OnBoarding />} />
    )}
  </Routes>
)

export default AppRoute
