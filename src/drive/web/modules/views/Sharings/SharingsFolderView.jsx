import React, { useCallback, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useQuery, useClient } from 'cozy-client'
import { SharingContext } from 'cozy-sharing'
import SharedDocuments from 'cozy-sharing/dist/components/SharedDocuments'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { ModalContext } from 'drive/lib/ModalContext'
import { useFolderSort } from 'drive/web/modules/navigation/duck'
import {
  buildDriveQuery,
  buildFileWithSpecificMetadataAttributeQuery
} from 'drive/web/modules/queries'
import { useCurrentFolderId } from 'drive/web/modules/selectors'
import useActions from 'drive/web/modules/actions/useActions'
import {
  share,
  download,
  trash,
  open,
  rename,
  move,
  qualify,
  versions,
  offline
} from 'drive/web/modules/actions'
import Toolbar from 'drive/web/modules/drive/Toolbar'
import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'
import { useExtraColumns } from 'drive/web/modules/certifications/useExtraColumns'
import { makeExtraColumnsNamesFromMedia } from 'drive/web/modules/certifications'
import useHead from 'components/useHead'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

const SharingsFolderView = ({ sharedDocumentIds, router, children }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const currentFolderId = useCurrentFolderId()
  const { isMobile } = useBreakpoints()

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
      if (folderId) router.push(`/sharings/${folderId}`)
      else router.push('/sharings')
    },
    [router]
  )

  const navigateToFile = useCallback(
    file => {
      router.push(`/sharings/${currentFolderId}/file/${file.id}`)
    },
    [router, currentFolderId]
  )

  const client = useClient()
  const { hasWriteAccess } = useContext(SharingContext)
  const { pushModal, popModal } = useContext(ModalContext)
  const { refresh } = useContext(SharingContext)
  const dispatch = useDispatch()
  const actionsOptions = {
    client,
    pushModal,
    popModal,
    refresh,
    dispatch,
    navigate,
    pathname,
    hasWriteAccess: hasWriteAccess(currentFolderId),
    canMove: true
  }
  const actions = useActions(
    [share, download, trash, open, rename, move, qualify, versions, offline],
    actionsOptions
  )

  const { t } = useI18n()
  const rootBreadcrumbPath = {
    name: t('breadcrumb.title_sharings')
  }

  return (
    <FolderView>
      <FolderViewHeader>
        {currentFolderId && (
          <FolderViewBreadcrumb
            sharedDocumentIds={sharedDocumentIds}
            rootBreadcrumbPath={rootBreadcrumbPath}
            currentFolderId={currentFolderId}
            navigateToFolder={navigateToFolder}
          />
        )}
        <Toolbar canUpload={hasWriteAccess} canCreateFolder={hasWriteAccess} />
      </FolderViewHeader>
      <FolderViewBody
        navigateToFolder={navigateToFolder}
        navigateToFile={navigateToFile}
        actions={actions}
        queryResults={[foldersResult, filesResult]}
        canSort
        extraColumns={extraColumns}
      />
      {children}
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
