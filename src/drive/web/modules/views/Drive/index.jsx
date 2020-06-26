import React, { useCallback, useContext } from 'react'
import { connect } from 'react-redux'
import { useQuery } from 'cozy-client'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'

import { SharingContext } from 'cozy-sharing'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useActions from 'drive/web/modules/actions/useActions'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'
import Toolbar from 'drive/web/modules/drive/Toolbar'
import { ROOT_DIR_ID } from 'drive/constants/config'

import { buildDriveQuery } from 'drive/web/modules/queries'
import { getCurrentFolderId } from 'drive/web/modules/selectors'
import { useFolderSort } from 'drive/web/modules/navigation/duck'

const getBreadcrumbPath = (t, displayedFolder) =>
  uniqBy(
    [
      {
        id: ROOT_DIR_ID
      },
      {
        id: get(displayedFolder, 'dir_id')
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
      name:
        breadcrumb.name ||
        (breadcrumb.id === ROOT_DIR_ID ? t('breadcrumb.title_drive') : '…')
    }))

const DriveView = ({ currentFolderId, router, children }) => {
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

  const isInError =
    foldersResult.fetchStatus === 'error' || filesResult.fetchStatus === 'error'
  const isLoading =
    (foldersResult.fetchStatus === 'loading' && !foldersResult.lastUpdate) ||
    (filesResult.fetchStatus === 'loading' && !filesResult.lastUpdate)
  const isPending =
    foldersResult.fetchStatus === 'pending' ||
    filesResult.fetchStatus === 'pending'

  const navigateToFolder = useCallback(folderId => {
    router.push(`/folder/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/folder/${currentFolderId}/file/${file.id}`)
  })

  const { hasWriteAccess } = useContext(SharingContext)
  const actions = useActions({
    hasWriteAccess: hasWriteAccess(currentFolderId),
    canMove: true
  })

  const { t } = useI18n()
  const geTranslatedBreadcrumbPath = useCallback(
    displayedFolder => getBreadcrumbPath(t, displayedFolder),
    [t]
  )

  return (
    <FolderView>
      <FolderViewHeader>
        <FolderViewBreadcrumb
          getBreadcrumbPath={geTranslatedBreadcrumbPath}
          currentFolderId={currentFolderId}
          navigateToFolder={navigateToFolder}
        />
        <Toolbar
          canUpload={true}
          canCreateFolder={true}
          disabled={isLoading || isInError || isPending}
        />
      </FolderViewHeader>
      <FolderViewBody
        navigateToFolder={navigateToFolder}
        navigateToFile={navigateToFile}
        actions={actions}
        queryResults={[foldersResult, filesResult]}
        canSort
        currentFolderId={currentFolderId}
      />
      {children}
    </FolderView>
  )
}

export default connect(state => ({
  currentFolderId: getCurrentFolderId(state) || ROOT_DIR_ID
}))(DriveView)
