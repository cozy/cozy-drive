import React, { useCallback, useContext } from 'react'

import get from 'lodash/get'

import { connect } from 'react-redux'
import { useQuery, useClient } from 'cozy-client'
import { SharingContext } from 'cozy-sharing'
import { ModalContext } from 'drive/lib/ModalContext'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { useDispatch } from 'react-redux'
import { useFolderSort } from 'drive/web/modules/navigation/duck'
import { buildDriveQuery } from 'drive/web/modules/queries'
import { getCurrentFolderId } from 'drive/web/modules/selectors'

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
import SharedDocuments from 'cozy-sharing/dist/components/SharedDocuments'

const getBreadcrumbPath = (t, displayedFolder, sharedDocumentIds) => {
  const breadcrumbs = [
    {
      id: sharedDocumentIds.includes(get(displayedFolder, 'dir_id')) // TODO: use hasSharedParent or similar from cozy-sharing
        ? get(displayedFolder, 'dir_id')
        : null
    },
    {
      id: displayedFolder.id,
      name: displayedFolder.name
    }
  ].filter(({ id }) => Boolean(id))

  breadcrumbs.unshift({ name: t('breadcrumb.title_sharings') })
  return breadcrumbs.map(breadcrumb => ({
    id: breadcrumb.id,
    name: breadcrumb.name || '…'
  }))
}

const SharingsFolderView = ({
  currentFolderId,
  sharedDocumentIds,
  router,
  location,
  children
}) => {
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
    router,
    location,
    hasWriteAccess: hasWriteAccess(currentFolderId),
    canMove: true
  }
  const actions = useActions(
    [share, download, trash, open, rename, move, qualify, versions, offline],
    actionsOptions
  )

  const { t } = useI18n()
  const geTranslatedBreadcrumbPath = useCallback(
    displayedFolder => getBreadcrumbPath(t, displayedFolder, sharedDocumentIds),
    [t, sharedDocumentIds]
  )

  return (
    <FolderView>
      <FolderViewHeader>
        <FolderViewBreadcrumb
          getBreadcrumbPath={geTranslatedBreadcrumbPath}
          currentFolderId={currentFolderId}
          navigateToFolder={navigateToFolder}
        />
        <Toolbar canUpload={hasWriteAccess} canCreateFolder={hasWriteAccess} />
      </FolderViewHeader>
      <FolderViewBody
        navigateToFolder={navigateToFolder}
        navigateToFile={navigateToFile}
        actions={actions}
        queryResults={[foldersResult, filesResult]}
        canSort
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

export default connect(state => ({
  currentFolderId: getCurrentFolderId(state)
}))(FolderViewWithSharings)
