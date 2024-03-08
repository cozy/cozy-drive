import { useCurrentFolderId, useDisplayedFolder } from 'hooks'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Outlet, useLocation, useParams } from 'react-router-dom'

import { useQuery, useClient } from 'cozy-client'
import flag from 'cozy-flags'
import { useVaultClient } from 'cozy-keys-lib'
import { useSharingContext } from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import HarvestBanner from './HarvestBanner'
import useHead from 'components/useHead'
import { ROOT_DIR_ID } from 'constants/config'
import { FabContext } from 'lib/FabProvider'
import { useModalContext } from 'lib/ModalContext'
import {
  share,
  download,
  trash,
  rename,
  move,
  duplicate,
  qualify,
  versions,
  hr
} from 'modules/actions'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import { useExtraColumns } from 'modules/certifications/useExtraColumns'
import AddMenuProvider from 'modules/drive/AddMenu/AddMenuProvider'
import FabWithMenuContext from 'modules/drive/FabWithMenuContext'
import Toolbar from 'modules/drive/Toolbar'
import { useFolderSort } from 'modules/navigation/duck'
import {
  buildDriveQuery,
  buildFileWithSpecificMetadataAttributeQuery
} from 'modules/queries'
import { useSelectionContext } from 'modules/selection/SelectionProvider'
import Dropzone from 'modules/upload/Dropzone'
import { useTrashRedirect } from 'modules/views/Drive/useTrashRedirect'
import FolderView from 'modules/views/Folder/FolderView'
import FolderViewBody from 'modules/views/Folder/FolderViewBody'
import FolderViewBreadcrumb from 'modules/views/Folder/FolderViewBreadcrumb'
import FolderViewHeader from 'modules/views/Folder/FolderViewHeader'
import { useResumeUploadFromFlagship } from 'modules/views/Upload/useResumeFromFlagship'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

const DriveView = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const params = useParams()
  const currentFolderId = useCurrentFolderId() || ROOT_DIR_ID
  useHead()
  const { isSelectionBarVisible } = useSelectionContext()
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const { isFabDisplayed, setIsFabDisplayed } = useContext(FabContext)
  const { allLoaded, hasWriteAccess, refresh } = useSharingContext()
  const client = useClient()
  const vaultClient = useVaultClient()
  const { pushModal, popModal } = useModalContext()
  const dispatch = useDispatch()
  const extraColumnsNames = makeExtraColumnsNamesFromMedia({
    isMobile,
    desktopExtraColumnsNames,
    mobileExtraColumnsNames
  })

  const extraColumns = useExtraColumns({
    columnsNames: extraColumnsNames,
    queryBuilder: buildFileWithSpecificMetadataAttributeQuery,
    currentFolderId
  })

  const { displayedFolder, isNotFound } = useDisplayedFolder()

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

  const foldersResult = useQuery(folderQuery.definition, folderQuery.options)
  const filesResult = useQuery(fileQuery.definition, fileQuery.options)

  const allResults = [foldersResult, filesResult]

  const isInError = allResults.some(result => result.fetchStatus === 'failed')
  const isLoading = allResults.some(
    result => result.fetchStatus === 'loading' && !result.lastUpdate
  )
  const isPending = allResults.some(result => result.fetchStatus === 'pending')

  const navigateToFolder = useCallback(
    folderId => {
      navigate(`/folder/${folderId}`)
    },
    [navigate]
  )

  const navigateToFile = useCallback(
    file => {
      navigate(`/folder/${currentFolderId}/file/${file.id}`)
    },
    [navigate, currentFolderId]
  )

  const canWriteToCurrentFolder = hasWriteAccess(currentFolderId)
  const actionsOptions = {
    client,
    t,
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
    allLoaded
  }
  const actions = makeActions(
    [
      share,
      download,
      hr,
      qualify,
      rename,
      move,
      duplicate,
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
      setIsFabDisplayed(isMobile)
      return () => {
        // to not have this set to false on other views after using this view
        setIsFabDisplayed(false)
      }
    }
  }, [setIsFabDisplayed, isMobile, canWriteToCurrentFolder])

  return (
    <FolderView isNotFound={isNotFound}>
      <FolderViewHeader>
        {currentFolderId && (
          <FolderViewBreadcrumb
            rootBreadcrumbPath={rootBreadcrumbPath}
            currentFolderId={currentFolderId}
            navigateToFolder={navigateToFolder}
          />
        )}
        <Toolbar
          canUpload={true}
          canCreateFolder={true}
          disabled={isLoading || isInError || isPending}
        />
      </FolderViewHeader>
      <Dropzone
        role="main"
        disabled={!canWriteToCurrentFolder}
        displayedFolder={displayedFolder}
      >
        {flag('drive.show.harvest-banner') && (
          <HarvestBanner folderId={currentFolderId} />
        )}
        <FolderViewBody
          navigateToFolder={navigateToFolder}
          navigateToFile={navigateToFile}
          actions={actions}
          queryResults={[foldersResult, filesResult]}
          canSort
          currentFolderId={currentFolderId}
          displayedFolder={displayedFolder}
          extraColumns={extraColumns}
        />
        {isFabDisplayed && (
          <AddMenuProvider
            canCreateFolder={true}
            canUpload={true}
            disabled={isLoading || isInError || isPending}
            navigate={navigate}
            params={params}
            displayedFolder={displayedFolder}
            isSelectionBarVisible={isSelectionBarVisible}
          >
            <FabWithMenuContext />
          </AddMenuProvider>
        )}
        <Outlet />
      </Dropzone>
    </FolderView>
  )
}

export default DriveView
