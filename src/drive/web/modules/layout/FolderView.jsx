/* global __TARGET__ */
import React from 'react'
import { compose } from 'redux'

import { translate } from 'cozy-ui/transpiled/react/I18n'

import { ModalManager } from 'react-cozy-helpers'
import { ROOT_DIR_ID } from 'drive/constants/config'

import MediaBackupProgression from 'drive/mobile/modules/mediaBackup/MediaBackupProgression'
import RatingModal from 'drive/mobile/modules/settings/RatingModal'
import FirstUploadModal from 'drive/mobile/modules/mediaBackup/FirstUploadModal'
import FileList from 'drive/web/modules/filelist/FileList'
import Breadcrumb from 'drive/web/modules/navigation/Breadcrumb'
import SelectionBar from 'drive/web/modules/selection/SelectionBar'
import Dropzone from 'drive/web/modules/upload/Dropzone'
import AsyncBoundary from 'drive/web/modules/navigation/AsyncBoundary'
import { getFolderIdFromRoute } from 'drive/web/modules/navigation/duck'

import Main from './Main'
import Topbar from './Topbar'
const FolderView = props => {
  const {
    children,
    isTrashContext,
    displayedFolder,
    files,
    actions,
    Toolbar,
    canSort,
    canDrop,
    canUpload,
    canCreateFolder,
    location,
    params,
    onFolderOpen,
    fileCount,
    fetchMoreFiles,
    onFileOpen,
    withFilePath,
    withSharedBadge,
    isRenaming,
    renamingFile,
    hasWriteAccess
  } = props
  const nothingToDo = isTrashContext && files.length === 0
  const folderId = getFolderIdFromRoute(location, params)
  const isRootfolder = folderId === ROOT_DIR_ID
  return (
    <Main>
      <Topbar>
        <Breadcrumb onFolderOpen={onFolderOpen} />
        <AsyncBoundary>
          {({ isLoading, isInError }) => (
            <Toolbar
              folderId={folderId}
              canUpload={canUpload}
              canCreateFolder={canCreateFolder}
              disabled={isInError || isLoading || nothingToDo}
            />
          )}
        </AsyncBoundary>
      </Topbar>
      <Dropzone
        role="main"
        disabled={__TARGET__ === 'mobile' || !canDrop || !hasWriteAccess}
        displayedFolder={displayedFolder}
      >
        {__TARGET__ === 'mobile' && (
          <div>
            {isRootfolder && <MediaBackupProgression />}
            <FirstUploadModal />
            <RatingModal />
          </div>
        )}
        <SelectionBar actions={actions.selection} />
        <FileList
          canSort={canSort}
          fileActions={actions.selection}
          files={files}
          fileCount={fileCount}
          fetchMoreFiles={fetchMoreFiles}
          displayedFolder={displayedFolder}
          onFolderOpen={onFolderOpen}
          onFileOpen={onFileOpen}
          withFilePath={withFilePath}
          withSharedBadge={withSharedBadge}
          isRenaming={isRenaming}
          renamingFile={renamingFile}
        />
        {renderViewer(children, files)}
      </Dropzone>
      <ModalManager />
    </Main>
  )
}

const renderViewer = (children, files) => {
  if (!children) return null
  return React.Children.map(children, child =>
    React.cloneElement(child, {
      files: files || []
    })
  )
}
export default compose(translate())(FolderView)
