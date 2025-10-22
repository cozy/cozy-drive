import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'

import { useQuery, useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import SharedDocuments from 'cozy-sharing/dist/components/SharedDocuments'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import FolderView from '../Folder/FolderView'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'
import FolderViewHeader from '../Folder/FolderViewHeader'

import useHead from '@/components/useHead'
import { useCurrentFolderId, useDisplayedFolder, useFolderSort } from '@/hooks'
import { useModalContext } from '@/lib/ModalContext'
import {
  share,
  download,
  trash,
  rename,
  qualify,
  versions,
  selectAllItems
} from '@/modules/actions'
import { moveTo } from '@/modules/actions/components/moveTo'
import { makeExtraColumnsNamesFromMedia } from '@/modules/certifications'
import { useExtraColumns } from '@/modules/certifications/useExtraColumns'
import Toolbar from '@/modules/drive/Toolbar'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import Dropzone from '@/modules/upload/Dropzone'
import {
  buildDriveQuery,
  buildFileWithSpecificMetadataAttributeQuery
} from '@/queries'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

const SharingsFolderView = ({ sharedDocumentIds }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const currentFolderId = useCurrentFolderId()
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const { showAlert } = useAlert()
  const client = useClient()
  const { allLoaded, hasWriteAccess, refresh, isOwner, byDocId } =
    useSharingContext()
  const { pushModal, popModal } = useModalContext()
  const dispatch = useDispatch()
  const { displayedFolder, isNotFound } = useDisplayedFolder()
  const { toggleSelectAllItems, isSelectAll } = useSelectionContext()
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

  const hasWrite = hasWriteAccess(currentFolderId)

  const actionsOptions = {
    client,
    t,
    pushModal,
    popModal,
    refresh,
    dispatch,
    navigate,
    showAlert,
    pathname,
    hasWriteAccess: hasWrite,
    canMove: true,
    allLoaded,
    isOwner,
    byDocId,
    selectAll: () =>
      toggleSelectAllItems(
        [foldersResult, filesResult].map(query => query.data).flat()
      ),
    isSelectAll
  }
  const actions = makeActions(
    [selectAllItems, share, download, trash, rename, moveTo, qualify, versions],
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
      <Dropzone disabled={!hasWrite} displayedFolder={displayedFolder}>
        <FolderViewHeader>
          {currentFolderId && (
            <FolderViewBreadcrumb
              sharedDocumentIds={sharedDocumentIds}
              rootBreadcrumbPath={rootBreadcrumbPath}
              currentFolderId={currentFolderId}
            />
          )}
          <Toolbar canUpload={hasWrite} canCreateFolder={hasWrite} />
        </FolderViewHeader>
        <FolderViewBody
          actions={actions}
          queryResults={[foldersResult, filesResult]}
          canSort
          extraColumns={extraColumns}
          currentFolderId={currentFolderId}
        />
        <Outlet />
      </Dropzone>
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
