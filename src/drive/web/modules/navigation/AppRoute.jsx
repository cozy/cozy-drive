/* global __TARGET__ , __DEVELOPMENT__*/
import React from 'react'
import { Route, Redirect } from 'react-router'

import Settings from 'drive/mobile/modules/settings/Settings'
import OnBoarding from 'drive/mobile/modules/onboarding/OnBoarding'

import Layout from 'drive/web/modules/layout/Layout'
import FileExplorer from './FileExplorer'
import FilesViewer from 'drive/web/modules/viewer/FilesViewer'
import FileOpenerExternal from 'drive/web/modules/viewer/FileOpenerExternal'
import { ScannerQualification } from 'cozy-scanner'
import {
  FolderContainer as Folder,
  RecentContainer as Recent,
  SharingsContainer as Sharings
} from 'drive/web/modules/drive'
import { Container as Trash } from 'drive/web/modules/trash'
import FileHistory from '../../../../components/FileHistory'
import UploadFromMobile from 'drive/mobile/modules/upload'

import 'cozy-sharing/dist/stylesheet.css'

const AppRoute = (
  <Route>
    <Route component={Layout}>
      {/**@TODO remove this route when we have a cordova playground */}
      {__DEVELOPMENT__ && (
        <Route path="/scan" component={ScannerQualification} />
      )}
      {__TARGET__ === 'mobile' && (
        <Route path="uploadfrommobile" component={UploadFromMobile} />
      )}
      <Redirect from="/files/:folderId" to="/folder/:folderId" />
      <Route component={FileExplorer}>
        <Redirect from="/" to="folder" />
        <Route path="folder" component={Folder}>
          <Route path=":folderId">
            <Route path="file/:fileId" component={FilesViewer} />
            <Route path="file/:fileId/revision" component={FileHistory} />
          </Route>
          {/* Those 2 following routes are needed for the root directory since the url is only /folder, so 
          next url will be /folder/file/:fileId/ */}
          <Route path="file/:fileId" component={FilesViewer} />
          <Route path="file/:fileId/revision" component={FileHistory} />
        </Route>
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
