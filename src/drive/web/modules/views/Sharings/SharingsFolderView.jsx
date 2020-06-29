import React, { useCallback, useContext } from 'react'

import get from 'lodash/get'

import { connect } from 'react-redux'
import { useQuery } from 'cozy-client'
import { SharingContext } from 'cozy-sharing'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { useFolderSort } from 'drive/web/modules/navigation/duck'
import useActions from 'drive/web/modules/actions/useActions'
import { buildDriveQuery } from 'drive/web/modules/queries'
import { getCurrentFolderId } from 'drive/web/modules/selectors'

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

  const navigateToFolder = useCallback(folderId => {
    if (folderId) router.push(`/sharings/${folderId}`)
    else router.push('/sharings')
  })

  const navigateToFile = useCallback(file => {
    router.push(`/sharings/${currentFolderId}/file/${file.id}`)
  })

  const { hasWriteAccess } = useContext(SharingContext)
  const actions = useActions({
    hasWriteAccess: hasWriteAccess(currentFolderId),
    canMove: true
  })

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
