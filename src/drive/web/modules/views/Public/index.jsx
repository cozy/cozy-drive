/* global __TARGET__ */

import React, { useState, useCallback, useContext } from 'react'
import { connect, useDispatch } from 'react-redux'
import { ModalManager } from 'react-cozy-helpers'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'

import { useClient, models } from 'cozy-client'
import { SharingContext } from 'cozy-sharing'
import { isMobileApp } from 'cozy-device-helper'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Content, Overlay } from 'cozy-ui/transpiled/react'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { ModalStack, ModalContext } from 'drive/lib/ModalContext'
import useActions from 'drive/web/modules/actions/useActions'
import Main from 'drive/web/modules/layout/Main'
import { download, trash, rename, versions } from 'drive/web/modules/actions'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'
import PublicToolbar from 'drive/web/modules/public/PublicToolbar'
import PublicViewer from 'drive/web/modules/viewer/PublicViewer'
import {
  getCurrentFolderId,
  getDisplayedFolder,
  getParentFolder
} from 'drive/web/modules/selectors'
import usePublicFilesQuery from './usePublicFilesQuery'
import usePublicWritePermissions from './usePublicWritePermissions'
import { isThereFileWithThisMetadata } from 'drive/web/modules/filelist/duck'
import {
  CarbonCopy as CarbonCopyCell,
  ElectronicSafe as ElectronicSafeCell
} from 'drive/web/modules/filelist/cells'
import {
  CarbonCopy as CarbonCopyHeader,
  ElectronicSafe as ElectronicSafeHeader
} from 'drive/web/modules/filelist/headers'

const getBreadcrumbPath = (t, displayedFolder, parentFolder) =>
  uniqBy(
    [
      {
        id: get(parentFolder, 'id'),
        name: get(parentFolder, 'name')
      },
      {
        id: displayedFolder.id,
        name: displayedFolder.name
      }
    ],
    'id'
  )
    .filter(({ id }) => Boolean(id))
    .map(breadcrumb => ({
      id: breadcrumb.id,
      name: breadcrumb.name || '…'
    }))

const PublicFolderView = ({
  currentFolderId,
  parentFolder,
  router,
  location,
  children
}) => {
  const client = useClient()
  const { isMobile } = useBreakpoints()

  const showAdditionalColumns = !isMobile && __TARGET__ !== 'mobile'

  const [viewerOpened, setViewerOpened] = useState(false)
  const [currentViewerIndex, setCurrentViewerIndex] = useState(null)

  const filesResult = usePublicFilesQuery(currentFolderId)
  const files = filesResult.data

  const viewableFiles = files.filter(f => f.type !== 'directory')

  const refreshFolderContent = () => filesResult.forceRefetch() // We don't have enough permissions to rely on the realtime notifications or on a cozy-client query to update the view when something changes, so we relaod the view instead

  const navigateToFolder = useCallback(
    folderId => {
      router.push(`/folder/${folderId}`)
    },
    [router]
  )

  const navigateToFile = async file => {
    const isNote = models.file.isNote(file)
    if (isNote) {
      try {
        const noteUrl = await models.note.fetchURL(client, file)
        const url = new URL(noteUrl)
        if (!isMobileApp()) {
          url.searchParams.set('returnUrl', window.location.href)
        }
        window.location.href = url.toString()
      } catch (e) {
        Alerter.error('alert.offline')
      }
    } else {
      setViewerOpened(true)
      showInViewer(file)
    }
  }

  const showInViewer = useCallback(
    file => {
      const currentIndex = viewableFiles.findIndex(f => f.id === file.id)
      setCurrentViewerIndex(currentIndex)

      const currentIndexInResults = files.findIndex(f => f.id === file.id)
      if (filesResult.hasMore && files.length - currentIndexInResults <= 5) {
        filesResult.fetchMore()
      }
    },
    [viewableFiles, files, filesResult]
  )

  const closeViewer = useCallback(() => setViewerOpened(false), [
    setViewerOpened
  ])

  const { hasWritePermissions } = usePublicWritePermissions()

  const { pushModal, popModal } = useContext(ModalContext)
  const { refresh } = useContext(SharingContext)
  const dispatch = useDispatch()

  const refreshAfterChange = () => {
    refresh()
    refreshFolderContent()
  }

  const actionOptions = {
    client,
    pushModal,
    popModal,
    refresh: refreshAfterChange,
    dispatch,
    router,
    location,
    hasWriteAccess: hasWritePermissions,
    canMove: false
  }
  const actions = useActions([download, trash, rename, versions], actionOptions)

  const { t } = useI18n()
  const geTranslatedBreadcrumbPath = useCallback(
    displayedFolder => getBreadcrumbPath(t, displayedFolder, parentFolder),
    [t, parentFolder]
  )

  return (
    <>
      <Main isPublic={true}>
        <ModalStack />
        <ModalManager />
        <PublicToolbar
          files={files}
          hasWriteAccess={hasWritePermissions}
          refreshFolderContent={refreshFolderContent}
        />
        <div className="u-pt-2">
          <FolderViewHeader>
            {currentFolderId && (
              <FolderViewBreadcrumb
                getBreadcrumbPath={geTranslatedBreadcrumbPath}
                currentFolderId={currentFolderId}
                navigateToFolder={navigateToFolder}
              />
            )}
          </FolderViewHeader>
          <Content>
            <FolderViewBody
              navigateToFolder={navigateToFolder}
              navigateToFile={navigateToFile}
              actions={actions}
              queryResults={[filesResult]}
              canSort={false}
              currentFolderId={currentFolderId}
              refreshFolderContent={refreshFolderContent}
              canUpload={hasWritePermissions}
              {...showAdditionalColumns && {
                additionalColumns: {
                  carbonCopy: {
                    condition: isThereFileWithThisMetadata(files, 'carbonCopy'),
                    label: 'carbonCopy',
                    HeaderComponent: CarbonCopyHeader,
                    CellComponent: CarbonCopyCell
                  },
                  electronicSafe: {
                    condition: isThereFileWithThisMetadata(
                      files,
                      'electronicSafe'
                    ),
                    label: 'electronicSafe',
                    HeaderComponent: ElectronicSafeHeader,
                    CellComponent: ElectronicSafeCell
                  }
                }
              }}
            />
            {viewerOpened &&
              viewableFiles.length > 0 && (
                <Overlay>
                  <PublicViewer
                    files={viewableFiles}
                    currentIndex={currentViewerIndex}
                    onChangeRequest={showInViewer}
                    onCloseRequest={closeViewer}
                  />
                </Overlay>
              )}
            {children}
          </Content>
        </div>
      </Main>
    </>
  )
}

export default connect(state => {
  const displayedFolder = getDisplayedFolder(state)
  const parentDirId = get(displayedFolder, 'dir_id')
  return {
    currentFolderId: getCurrentFolderId(state),
    displayedFolder,
    parentFolder: getParentFolder(state, parentDirId)
  }
})(PublicFolderView)
