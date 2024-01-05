import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { models } from 'cozy-client'

import PublicLayout from 'drive/web/modules/public/PublicLayout'
import PublicFolderView from 'drive/web/modules/views/Public'
import LightFileViewer from 'drive/web/modules/public/LightFileViewer'
import FileHistory from 'components/FileHistory'
import OnlyOfficePaywallView from 'drive/web/modules/views/OnlyOffice/OnlyOfficePaywallView'
import OnlyOfficeView from 'drive/web/modules/views/OnlyOffice'
import OnlyOfficeCreateView from 'drive/web/modules/views/OnlyOffice/Create'
import { isOfficeEnabled } from 'drive/web/modules/views/OnlyOffice/helpers'
import ExternalRedirect from 'drive/web/modules/navigation/ExternalRedirect'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const AppRouter = ({
  isReadOnly,
  username,
  isOnlyOfficeDocShared,
  sharedDocumentId,
  data
}) => {
  const { isDesktop } = useBreakpoints()
  const isFile = data && data.type === 'file'

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {isOfficeEnabled(isDesktop) ? (
          <>
            <Route
              path="onlyoffice/:fileId"
              element={
                <OnlyOfficeView
                  isPublic={true}
                  isReadOnly={isReadOnly}
                  username={username}
                  isFromSharing={isOnlyOfficeDocShared}
                  isInSharedFolder={!isFile}
                />
              }
            >
              <Route
                path="paywall"
                element={<OnlyOfficePaywallView isPublic={true} />}
              />
            </Route>
            <Route
              path="onlyoffice/create/:folderId/:fileClass"
              element={<OnlyOfficeCreateView isPublic={true} />}
            />
            {models.file.shouldBeOpenedByOnlyOffice(data) && (
              <Route
                path="/"
                element={<Navigate to={`onlyoffice/${data.id}`} replace />}
              />
            )}
          </>
        ) : (
          <Route path="onlyoffice/*" element={<Navigate to="/" />} />
        )}

        {isFile && (
          <Route path="/" element={<LightFileViewer files={[data]} />} />
        )}

        {!isFile && (
          <>
            <Route
              path="/files/:folderId"
              element={<Navigate to="/folder/:folderId" />}
            />
            <Route path="folder" element={<PublicFolderView />}>
              <Route path="file/:fileId/revision" element={<FileHistory />} />
              <Route
                path="paywall"
                element={<OnlyOfficePaywallView isPublic={true} />}
              />
            </Route>
            <Route path="folder/:folderId" element={<PublicFolderView />}>
              <Route path="file/:fileId/revision" element={<FileHistory />} />
              <Route
                path="paywall"
                element={<OnlyOfficePaywallView isPublic={true} />}
              />
            </Route>

            <Route path="external/:fileId" element={<ExternalRedirect />} />
            <Route
              path="/*"
              element={<Navigate to={`folder/${sharedDocumentId}`} />}
            />
          </>
        )}
      </Route>
    </Routes>
  )
}

export default AppRouter
