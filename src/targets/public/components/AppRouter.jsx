import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { models } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import FileHistory from 'components/FileHistory'
import ExternalRedirect from 'modules/navigation/ExternalRedirect'
import LightFileViewer from 'modules/public/LightFileViewer'
import PublicLayout from 'modules/public/PublicLayout'
import OnlyOfficeView from 'modules/views/OnlyOffice'
import OnlyOfficeCreateView from 'modules/views/OnlyOffice/Create'
import OnlyOfficePaywallView from 'modules/views/OnlyOffice/OnlyOfficePaywallView'
import { isOfficeEnabled } from 'modules/views/OnlyOffice/helpers'
import { PublicFolderView } from 'modules/views/Public/PublicFolderView'

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
          <Route
            path="/"
            element={<LightFileViewer files={[data]} isPublic={true} />}
          />
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
