import React from 'react'
import { Router, Route, Redirect, hashHistory } from 'react-router'

import { models } from 'cozy-client'

import PublicLayout from 'drive/web/modules/public/PublicLayout'
import PublicFolderView from 'drive/web/modules/views/Public'
import LightFileViewer from 'drive/web/modules/public/LightFileViewer'
import FileHistory from 'components/FileHistory'
import OnlyOfficePaywallView from 'drive/web/modules/views/OnlyOffice/OnlyOfficePaywallView'
import { redirectToOnlyOfficePaywall } from 'drive/web/modules/views/OnlyOffice/helpers'
import OnlyOfficeView from 'drive/web/modules/views/OnlyOffice'
import OnlyOfficeCreateView from 'drive/web/modules/views/OnlyOffice/Create'
import { isOfficeEnabled } from 'drive/web/modules/views/OnlyOffice/helpers'
import ExternalRedirect from 'drive/web/modules/navigation/ExternalRedirect'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

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
    <Router history={hashHistory}>
      <Route component={PublicLayout}>
        {isOfficeEnabled(isDesktop) && (
          <>
            <Route
              path="onlyoffice/:fileId"
              component={props => (
                <OnlyOfficeView
                  {...props}
                  isPublic={true}
                  isReadOnly={isReadOnly}
                  username={username}
                  isFromSharing={isOnlyOfficeDocShared}
                  isInSharedFolder={!isFile}
                />
              )}
            >
              <Route
                path="paywall"
                component={props => (
                  <OnlyOfficePaywallView {...props} isPublic={true} />
                )}
              />
            </Route>
            <Route
              path="onlyoffice/:fileId/fromCreate"
              component={props => (
                <OnlyOfficeView
                  {...props}
                  isPublic={true}
                  isReadOnly={isReadOnly}
                  isInSharedFolder={!isFile}
                />
              )}
            />
            <Route
              onEnter={redirectToOnlyOfficePaywall}
              path="onlyoffice/create/:folderId/:fileClass"
              component={OnlyOfficeCreateView}
            />
            {models.file.shouldBeOpenedByOnlyOffice(data) && (
              <Redirect from="/" to={`onlyoffice/${data.id}`} />
            )}
          </>
        )}

        {isFile && (
          <Route
            path="/"
            component={() => <LightFileViewer files={[data]} />}
          />
        )}

        {!isFile && (
          <>
            <Redirect from="/files/:folderId" to="/folder/:folderId" />
            <Route path="folder(/:folderId)" component={PublicFolderView}>
              <Route path="file/:fileId/revision" component={FileHistory} />
              <Route
                path="paywall"
                component={props => (
                  <OnlyOfficePaywallView {...props} isPublic={true} />
                )}
              />
            </Route>

            <Route path="external/:fileId" component={ExternalRedirect} />
            <Redirect from="/*" to={`folder/${sharedDocumentId}`} />
          </>
        )}
      </Route>
    </Router>
  )
}

export default AppRouter
