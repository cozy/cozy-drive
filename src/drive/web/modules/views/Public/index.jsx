import React, { useState, useCallback, useContext, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { ModalManager } from 'react-cozy-helpers'
import cx from 'classnames'
import flag from 'cozy-flags'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'

import { useClient, models } from 'cozy-client'
import { SharingContext } from 'cozy-sharing'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Content, Overlay } from 'cozy-ui/transpiled/react'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { SharingBannerPlugin, useSharingInfos } from 'cozy-sharing'

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
import { useExtraColumns } from 'drive/web/modules/certifications/useExtraColumns'
import { makeExtraColumnsNamesFromMedia } from 'drive/web/modules/certifications'
import FabWithMenuContext from 'drive/web/modules/drive/FabWithMenuContext'
import AddMenuProvider from 'drive/web/modules/drive/AddMenu/AddMenuProvider'
import { FabContext } from 'drive/lib/FabProvider'

import usePublicFilesQuery from './usePublicFilesQuery'
import usePublicWritePermissions from './usePublicWritePermissions'
import { ROOT_DIR_ID } from 'drive/constants/config'
import OldFolderViewBreadcrumb from '../Folder/OldFolderViewBreadcrumb'

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

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []
const folderUrlToNavigate = folderId => `/folder/${folderId}`

const PublicFolderView = ({
  currentFolderId,
  parentFolder,
  router,
  location,
  children
}) => {
  const client = useClient()
  const { isMobile } = useBreakpoints()
  const { isFabDisplayed, setIsFabDisplayed } = useContext(FabContext)

  const sharingInfos = useSharingInfos()

  const [viewerOpened, setViewerOpened] = useState(false)
  const [currentViewerIndex, setCurrentViewerIndex] = useState(null)

  const filesResult = usePublicFilesQuery(currentFolderId)
  const files = filesResult.data

  const extraColumnsNames = makeExtraColumnsNamesFromMedia({
    isMobile,
    desktopExtraColumnsNames,
    mobileExtraColumnsNames
  })

  const extraColumns = useExtraColumns({
    columnsNames: extraColumnsNames,
    conditionBuilder: ({ files, attribute }) =>
      files.some(file => models.file.hasMetadataAttribute({ file, attribute })),
    files
  })

  const viewableFiles = files.filter(f => f.type !== 'directory')

  const refreshFolderContent = () => filesResult.forceRefetch() // We don't have enough permissions to rely on the realtime notifications or on a cozy-client query to update the view when something changes, so we relaod the view instead

  const navigateToFolder = useCallback(
    folderId => {
      router.push(folderUrlToNavigate(folderId))
    },
    [router]
  )

  const navigateToFile = async file => {
    showInViewer(file)
    setViewerOpened(true)
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

  const rootBreadcrumbPath = {
    id: ROOT_DIR_ID,
    name: 'Public'
  }

  useEffect(() => {
    if (hasWritePermissions) {
      setIsFabDisplayed(isMobile)
      return () => {
        // to not have this set to false on other views after using this view
        setIsFabDisplayed(false)
      }
    }
  }, [setIsFabDisplayed, isMobile, hasWritePermissions])

  const showNewBreadcrumbFlag = flag(
    'drive.breadcrumb.showCompleteBreadcrumbOnPublicPage'
  )
  const isOldBreadcrumb =
    !showNewBreadcrumbFlag || showNewBreadcrumbFlag !== true

  return (
    <>
      <Main isPublic={true}>
        <ModalStack />
        <ModalManager />
        <SharingBannerPlugin />
        <div className={cx({ 'u-pt-2': !isMobile })}>
          <FolderViewHeader>
            {currentFolderId && (
              <>
                {isOldBreadcrumb ? (
                  <OldFolderViewBreadcrumb
                    currentFolderId={currentFolderId}
                    getBreadcrumbPath={geTranslatedBreadcrumbPath}
                    navigateToFolder={navigateToFolder}
                  />
                ) : (
                  <FolderViewBreadcrumb
                    rootBreadcrumbPath={rootBreadcrumbPath}
                    currentFolderId={currentFolderId}
                    navigateToFolder={navigateToFolder}
                  />
                )}
                <PublicToolbar
                  files={files}
                  hasWriteAccess={hasWritePermissions}
                  refreshFolderContent={refreshFolderContent}
                  sharingInfos={sharingInfos}
                />
              </>
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
              extraColumns={extraColumns}
            />
            {isFabDisplayed && (
              <AddMenuProvider
                canCreateFolder={hasWritePermissions}
                canUpload={hasWritePermissions}
                refreshFolderContent={refreshFolderContent}
                isPublic={true}
              >
                <FabWithMenuContext noSidebar={true} />
              </AddMenuProvider>
            )}
            {viewerOpened && viewableFiles.length > 0 && (
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
