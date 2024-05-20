import React from 'react'
import { Routes, Route, useParams, Navigate } from 'react-router-dom'

import flag from 'cozy-flags'

import ExternalRedirect from './ExternalRedirect'
import Index from './Index'
import { DriveFolderView } from '../views/Drive/DriveFolderView'
import FilesViewerDrive from '../views/Drive/FilesViewerDrive'
import OnlyOfficeView from '../views/OnlyOffice'
import OnlyOfficeCreateView from '../views/OnlyOffice/Create'
import OnlyOfficePaywallView from '../views/OnlyOffice/OnlyOfficePaywallView'
import RecentView from '../views/Recent'
import FilesViewerRecent from '../views/Recent/FilesViewerRecent'
import SearchView from '../views/Search/SearchView'
import SharingsView from '../views/Sharings'
import SharingsFilesViewer from '../views/Sharings/FilesViewerSharings'
import SharingsFolderView from '../views/Sharings/SharingsFolderView'
import FilesViewerTrash from '../views/Trash/FilesViewerTrash'
import TrashFolderView from '../views/Trash/TrashFolderView'
import FileHistory from 'components/FileHistory'
import { ROOT_DIR_ID } from 'constants/config'
import { UploaderComponent } from 'modules//views/Upload/UploaderComponent'
import Layout from 'modules/layout/Layout'
import FileOpenerExternal from 'modules/viewer/FileOpenerExternal'
import HarvestRoutes from 'modules/views/Drive/HarvestRoutes'
import { MoveFilesView } from 'modules/views/Modal/MoveFilesView'
import { QualifyFileView } from 'modules/views/Modal/QualifyFileView'
import { ShareDisplayedFolderView } from 'modules/views/Modal/ShareDisplayedFolderView'
import { ShareFileView } from 'modules/views/Modal/ShareFileView'
import { NextcloudFolderView } from 'modules/views/Nextcloud/NextcloudFolderView'

const FilesRedirect = () => {
  const { folderId } = useParams()
  return <Navigate to={`/folder/${folderId}`} replace={true} />
}

const AppRoute = () => (
  <Routes>
    <Route path="external/:fileId" element={<ExternalRedirect />} />
    <Route element={<Layout />}>
      <Route path="upload" element={<UploaderComponent />} />
      <Route path="/files/:folderId" element={<FilesRedirect />} />
      <Route path="/" element={<Index />} />

      <Route
        path="folder"
        element={<Navigate to={ROOT_DIR_ID} replace={true} />}
      />
      <Route path="folder/:folderId" element={<DriveFolderView />}>
        <Route path="file/:fileId" element={<FilesViewerDrive />} />
        <Route path="file/:fileId/revision" element={<FileHistory />} />
        <Route path="file/:fileId/share" element={<ShareFileView />} />
        <Route path="file/:fileId/qualify" element={<QualifyFileView />} />
        <Route path="paywall" element={<OnlyOfficePaywallView />} />
        <Route path="share" element={<ShareDisplayedFolderView />} />
        <Route path="move" element={<MoveFilesView />} />
        <Route path="harvest/:konnectorSlug/*" element={<HarvestRoutes />} />
      </Route>

      {flag('drive.show-nextcloud-dev') ? (
        <Route path="nextcloud/:shorcutId" element={<NextcloudFolderView />} />
      ) : null}

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

      <Route path="file/:fileId" element={<FileOpenerExternal />} />
      <Route path="search" element={<SearchView />} />
    </Route>
  </Routes>
)

export default AppRoute
