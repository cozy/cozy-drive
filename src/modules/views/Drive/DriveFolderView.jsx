import React, { useContext, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Outlet, useLocation, useParams } from 'react-router-dom'

import { useQuery, useClient } from 'cozy-client'
import flag from 'cozy-flags'
import { useVaultClient } from 'cozy-keys-lib'
import {
  useSharingContext,
  useNativeFileSharing,
  shareNative
} from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import HarvestBanner from './HarvestBanner'

import useHead from '@/components/useHead'
import { ROOT_DIR_ID } from '@/constants/config'
import { useCurrentFolderId, useDisplayedFolder } from '@/hooks'
import { FabContext } from '@/lib/FabProvider'
import { useModalContext } from '@/lib/ModalContext'
import { useThumbnailSizeContext } from '@/lib/ThumbnailSizeContext'
import {
  share,
  download,
  trash,
  rename,
  infos,
  versions,
  hr,
  selectAllItems
} from '@/modules/actions'
import { addToFavorites } from '@/modules/actions/components/addToFavorites'
import { duplicateTo } from '@/modules/actions/components/duplicateTo'
import { moveTo } from '@/modules/actions/components/moveTo'
import { removeFromFavorites } from '@/modules/actions/components/removeFromFavorites'
import { makeExtraColumnsNamesFromMedia } from '@/modules/certifications'
import { useExtraColumns } from '@/modules/certifications/useExtraColumns'
import AddMenuProvider from '@/modules/drive/AddMenu/AddMenuProvider'
import FabWithAddMenuContext from '@/modules/drive/FabWithAddMenuContext'
import Toolbar from '@/modules/drive/Toolbar'
import { useFolderSort } from '@/modules/navigation/duck'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import Dropzone from '@/modules/upload/Dropzone'
import DropzoneDnD from '@/modules/upload/DropzoneDnD'
import { useTrashRedirect } from '@/modules/views/Drive/useTrashRedirect'
import FolderView from '@/modules/views/Folder/FolderView'
import FolderViewBody from '@/modules/views/Folder/FolderViewBody'
import FolderViewBreadcrumb from '@/modules/views/Folder/FolderViewBreadcrumb'
import FolderViewHeader from '@/modules/views/Folder/FolderViewHeader'
import FolderViewBodyVz from '@/modules/views/Folder/virtualized/FolderViewBody'
import { useResumeUploadFromFlagship } from '@/modules/views/Upload/useResumeFromFlagship'
import {
  buildDriveQuery,
  buildFileWithSpecificMetadataAttributeQuery,
  buildMagicFolderQuery
} from '@/queries'

// Those extra columns names must match a metadata attribute name, e.g. carbonCopy or electronicSafe
const desktopExtraColumnsNames = []
const mobileExtraColumnsNames = []

const DriveFolderView = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const params = useParams()
  const currentFolderId = useCurrentFolderId()
  useHead()
  const { isSelectionBarVisible, toggleSelectAllItems, isSelectAll } =
    useSelectionContext()
  const { isMobile, isDesktop } = useBreakpoints()
  const { t, lang } = useI18n()
  const { isFabDisplayed, setIsFabDisplayed } = useContext(FabContext)
  const { isBigThumbnail, toggleThumbnailSize } = useThumbnailSizeContext()
  const { allLoaded, hasWriteAccess, refresh, isOwner, byDocId } =
    useSharingContext()
  const { isNativeFileSharingAvailable, shareFilesNative } =
    useNativeFileSharing()
  const client = useClient()
  const vaultClient = useVaultClient()
  const { pushModal, popModal } = useModalContext()
  const dispatch = useDispatch()
  const extraColumnsNames = makeExtraColumnsNamesFromMedia({
    isMobile,
    desktopExtraColumnsNames,
    mobileExtraColumnsNames
  })
  const { showAlert } = useAlert()

  const extraColumns = useExtraColumns({
    columnsNames: extraColumnsNames,
    queryBuilder: buildFileWithSpecificMetadataAttributeQuery,
    currentFolderId
  })

  const { displayedFolder: _displayedFolder, isNotFound } = useDisplayedFolder()

  const displayedFolder = useMemo(() => _displayedFolder, [_displayedFolder])

  useTrashRedirect(displayedFolder)

  const [sortOrder] = useFolderSort(currentFolderId)

  const folderQuery = buildDriveQuery({
    currentFolderId,
    type: 'directory',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })
  const fileQuery = buildDriveQuery({
    currentFolderId,
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })

  const sharedFolderQuery = buildMagicFolderQuery({
    id: 'io.cozy.files.shared-drives-dir',
    enabled: currentFolderId === ROOT_DIR_ID
  })

  const foldersResult = useQuery(folderQuery.definition, folderQuery.options)
  const filesResult = useQuery(fileQuery.definition, fileQuery.options)

  const sharedFolderResult = useQuery(
    sharedFolderQuery.definition,
    sharedFolderQuery.options
  )

  let allResults = [foldersResult, filesResult]
  if (currentFolderId === ROOT_DIR_ID) {
    // The folder may not be found if the user has not configured shared drives
    if (sharedFolderResult.fetchStatus === 'loaded') {
      allResults = [sharedFolderResult, foldersResult, filesResult]
    } else {
      allResults = [foldersResult, filesResult]
    }
  }

  const isInError = allResults.some(result => result.fetchStatus === 'failed')
  const isLoading = allResults.some(
    result => result.fetchStatus === 'loading' && !result.lastUpdate
  )
  const isPending = allResults.some(result => result.fetchStatus === 'pending')

  const canWriteToCurrentFolder = hasWriteAccess(currentFolderId)
  const actionsOptions = {
    client,
    t,
    lang,
    vaultClient,
    pushModal,
    popModal,
    refresh,
    dispatch,
    navigate,
    pathname,
    hasWriteAccess: canWriteToCurrentFolder,
    canMove: true,
    isPublic: false,
    allLoaded,
    showAlert,
    isOwner,
    byDocId,
    isMobile,
    isNativeFileSharingAvailable,
    shareFilesNative,
    selectAll: () =>
      toggleSelectAllItems(allResults.map(query => query.data).flat()),
    isSelectAll
  }
  const actions = makeActions(
    [
      selectAllItems,
      share,
      shareNative,
      download,
      hr,
      rename,
      moveTo,
      duplicateTo,
      addToFavorites,
      removeFromFavorites,
      infos,
      hr,
      versions,
      hr,
      trash
    ],
    actionsOptions
  )

  const rootBreadcrumbPath = useMemo(
    () => ({
      id: ROOT_DIR_ID,
      name: t('breadcrumb.title_drive')
    }),
    [t]
  )

  useResumeUploadFromFlagship()

  useEffect(() => {
    if (canWriteToCurrentFolder) {
      setIsFabDisplayed(!isDesktop)
      return () => {
        // to not have this set to false on other views after using this view
        setIsFabDisplayed(false)
      }
    }
  }, [setIsFabDisplayed, isDesktop, canWriteToCurrentFolder])

  const DropzoneComp =
    flag('drive.virtualization.enabled') && !isMobile ? DropzoneDnD : Dropzone

  return (
    <FolderView isNotFound={isNotFound}>
      <DropzoneComp
        disabled={!canWriteToCurrentFolder}
        displayedFolder={displayedFolder}
      >
        <FolderViewHeader>
          {currentFolderId && (
            <FolderViewBreadcrumb
              rootBreadcrumbPath={rootBreadcrumbPath}
              currentFolderId={currentFolderId}
            />
          )}
          <Toolbar
            canUpload={true}
            canCreateFolder={true}
            disabled={isLoading || isInError || isPending}
            isBigThumbnail={isBigThumbnail}
            toggleThumbnailSize={toggleThumbnailSize}
          />
        </FolderViewHeader>
        {flag('drive.show.harvest-banner') && (
          <HarvestBanner folderId={currentFolderId} />
        )}
        {flag('drive.virtualization.enabled') && !isMobile ? (
          <FolderViewBodyVz
            actions={actions}
            queryResults={allResults}
            currentFolderId={currentFolderId}
            displayedFolder={displayedFolder}
            extraColumns={extraColumns}
            canDrag
          />
        ) : (
          <FolderViewBody
            actions={actions}
            queryResults={allResults}
            canSort
            currentFolderId={currentFolderId}
            displayedFolder={displayedFolder}
            extraColumns={extraColumns}
          />
        )}
        {isFabDisplayed && (
          <AddMenuProvider
            componentsProps={{
              AddMenu: {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'left'
                }
              }
            }}
            canCreateFolder={true}
            canUpload={true}
            disabled={isLoading || isInError || isPending}
            navigate={navigate}
            params={params}
            displayedFolder={displayedFolder}
            isSelectionBarVisible={isSelectionBarVisible}
          >
            <FabWithAddMenuContext />
          </AddMenuProvider>
        )}
        <Outlet />
      </DropzoneComp>
    </FolderView>
  )
}

export { DriveFolderView }
