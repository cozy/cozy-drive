import { useCurrentFolderId, useDisplayedFolder } from 'hooks'
import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'

import { useQuery, useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import SharedDocuments from 'cozy-sharing/dist/components/SharedDocuments'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import FolderView from '../Folder/FolderView'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'
import FolderViewHeader from '../Folder/FolderViewHeader'
import useHead from 'components/useHead'
import { useModalContext } from 'lib/ModalContext'
import {
  share,
  download,
  trash,
  rename,
  move,
  qualify,
  versions
} from 'modules/actions'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import { useExtraColumns } from 'modules/certifications/useExtraColumns'
import Toolbar from 'modules/drive/Toolbar'
import { useFolderSort } from 'modules/navigation/duck'
import {
  buildDriveQuery,
  buildFileWithSpecificMetadataAttributeQuery
} from 'modules/queries'
import Dropzone from 'modules/upload/Dropzone'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

const SharingsFolderView = ({ sharedDocumentIds }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const currentFolderId = useCurrentFolderId()
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const client = useClient()
  const { hasWriteAccess, refresh } = useSharingContext()
  const { pushModal, popModal } = useModalContext()
  const dispatch = useDispatch()
  const { displayedFolder, isNotFound } = useDisplayedFolder()
  useHead()

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

  const navigateToFolder = useCallback(
    folderId => {
      if (folderId) navigate(`/sharings/${folderId}`)
      else navigate('/sharings')
    },
    [navigate]
  )

  const navigateToFile = useCallback(
    file => {
      navigate(`/sharings/${currentFolderId}/file/${file.id}`)
    },
    [navigate, currentFolderId]
  )

  const hasWrite = hasWriteAccess(currentFolderId)

  const actionsOptions = {
    client,
    t,
    pushModal,
    popModal,
    refresh,
    dispatch,
    navigate,
    pathname,
    hasWriteAccess: hasWrite,
    canMove: true
  }
  const actions = makeActions(
    [share, download, trash, rename, move, qualify, versions],
    actionsOptions
  )

  const rootBreadcrumbPath = useMemo(
    () => ({
      name: t('breadcrumb.title_sharings')
    }),
    [t]
  )

  return (
    <FolderView isNotFound={isNotFound}>
      <FolderViewHeader>
        {currentFolderId && (
          <FolderViewBreadcrumb
            sharedDocumentIds={sharedDocumentIds}
            rootBreadcrumbPath={rootBreadcrumbPath}
            currentFolderId={currentFolderId}
            navigateToFolder={navigateToFolder}
          />
        )}
        <Toolbar canUpload={hasWrite} canCreateFolder={hasWrite} />
      </FolderViewHeader>

      <Dropzone
        role="main"
        disabled={!hasWrite}
        displayedFolder={displayedFolder}
      >
        <FolderViewBody
          navigateToFolder={navigateToFolder}
          navigateToFile={navigateToFile}
          actions={actions}
          queryResults={[foldersResult, filesResult]}
          canSort
          extraColumns={extraColumns}
          currentFolderId={currentFolderId}
        />
      </Dropzone>

      <Outlet />
    </FolderView>
  )
}

const FolderViewWithSharings = props => (
  <SharedDocuments>
    {({ sharedDocuments }) => (
      <SharingsFolderView {...props} sharedDocumentIds={sharedDocuments} />
    )}
  </SharedDocuments>
)

export default FolderViewWithSharings
