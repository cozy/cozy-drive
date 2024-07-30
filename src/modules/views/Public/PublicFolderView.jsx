import cx from 'classnames'
import { useCurrentFolderId, useDisplayedFolder, useParentFolder } from 'hooks'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import React, { useState, useCallback, useContext, useEffect } from 'react'
import { ModalManager } from 'react-cozy-helpers'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom'

import { useClient, models } from 'cozy-client'
import flag from 'cozy-flags'
import {
  useSharingContext,
  SharingBannerPlugin,
  useSharingInfos
} from 'cozy-sharing'
import { Content } from 'cozy-ui/transpiled/react'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardOrDownloadButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardOrDownloadButton'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import usePublicFilesQuery from './usePublicFilesQuery'
import usePublicWritePermissions from './usePublicWritePermissions'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'
import FolderViewHeader from '../Folder/FolderViewHeader'
import OldFolderViewBreadcrumb from '../Folder/OldFolderViewBreadcrumb'
import { ROOT_DIR_ID } from 'constants/config'
import { FabContext } from 'lib/FabProvider'
import { ModalStack, useModalContext } from 'lib/ModalContext'
import { download, trash, rename, versions } from 'modules/actions'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import { useExtraColumns } from 'modules/certifications/useExtraColumns'
import AddMenuProvider from 'modules/drive/AddMenu/AddMenuProvider'
import FabWithMenuContext from 'modules/drive/FabWithMenuContext'
import Main from 'modules/layout/Main'
import PublicToolbar from 'modules/public/PublicToolbar'
import { useSelectionContext } from 'modules/selection/SelectionProvider'
import PublicViewer from 'modules/viewer/PublicViewer'

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

const PublicFolderView = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const params = useParams()
  const client = useClient()
  const { t, lang } = useI18n()
  const { isMobile } = useBreakpoints()
  const { isFabDisplayed, setIsFabDisplayed } = useContext(FabContext)
  const currentFolderId = useCurrentFolderId()
  const { displayedFolder } = useDisplayedFolder()
  const parentDirId = get(displayedFolder, 'dir_id')
  const parentFolder = useParentFolder(parentDirId)
  const { isSelectionBarVisible } = useSelectionContext()
  const { hasWritePermissions } = usePublicWritePermissions()
  const { pushModal, popModal } = useModalContext()
  const { refresh } = useSharingContext()
  const dispatch = useDispatch()
  const sharingInfos = useSharingInfos()
  const { showAlert } = useAlert()

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
    folder => {
      navigate(`/folder/${folder._id}`)
    },
    [navigate]
  )

  const navigateToFile = async file => {
    const isNote = models.file.isNote(file)
    if (isNote) {
      try {
        const noteUrl = await models.note.fetchURL(client, file)
        const url = new URL(noteUrl)
        url.searchParams.set('returnUrl', window.location.href)
        window.location.href = url.toString()
      } catch (e) {
        showAlert({ message: t('alert.offline'), severity: 'error' })
      }
    } else {
      showInViewer(file)
      setViewerOpened(true)
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

  const closeViewer = useCallback(
    () => setViewerOpened(false),
    [setViewerOpened]
  )

  const refreshAfterChange = () => {
    refresh()
    refreshFolderContent()
  }

  const actionOptions = {
    client,
    t,
    lang,
    pushModal,
    popModal,
    refresh: refreshAfterChange,
    dispatch,
    navigate,
    showAlert,
    pathname,
    hasWriteAccess: hasWritePermissions,
    canMove: false,
    isPublic: true
  }
  const actions = makeActions(
    [download, trash, rename, versions],
    actionOptions
  )

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
    <Main isPublic={true}>
      <ModalStack />
      <ModalManager />
      <SharingBannerPlugin />
      <span className={cx({ 'u-pt-2': !isMobile })} />
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
          isPublic={true}
        />
        {isFabDisplayed && (
          <AddMenuProvider
            canCreateFolder={hasWritePermissions}
            canUpload={hasWritePermissions}
            refreshFolderContent={refreshFolderContent}
            isPublic={true}
            navigate={navigate}
            params={params}
            displayedFolder={displayedFolder}
            isSelectionBarVisible={isSelectionBarVisible}
          >
            <FabWithMenuContext noSidebar={true} />
          </AddMenuProvider>
        )}
        {viewerOpened && viewableFiles.length > 0 && (
          <PublicViewer
            files={viewableFiles}
            currentIndex={currentViewerIndex}
            onChangeRequest={showInViewer}
            onCloseRequest={closeViewer}
          >
            <FooterActionButtons>
              <ForwardOrDownloadButton />
            </FooterActionButtons>
          </PublicViewer>
        )}
        <Outlet />
      </Content>
    </Main>
  )
}

export { PublicFolderView }
