import React, { useCallback } from 'react'

import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'

import { getCurrentFolderId } from 'drive/web/modules/selectors'
import { connect } from 'react-redux'
import { useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { buildDriveQuery } from 'drive/web/modules/queries'
import { useFolderSort } from 'drive/web/modules/navigation/duck'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'

import useActions from './useActions'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'

import TrashToolbar from 'drive/web/modules/trash/Toolbar'

const getBreadcrumbPath = (t, displayedFolder) =>
  uniqBy(
    [
      { id: TRASH_DIR_ID, name: t('breadcrumb.title_trash') },
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
    .filter(({ id }) => Boolean(id) && id !== ROOT_DIR_ID)
    .map(breadcrumb => ({
      id: breadcrumb.id,
      name: breadcrumb.name || '…'
    }))

const TrashFolderView = ({ currentFolderId, router, children }) => {
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
    router.push(`/trash/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/trash/file/${file.id}`)
  })

  const actions = useActions()

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
        <TrashToolbar />
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

export default connect(state => ({
  currentFolderId: getCurrentFolderId(state)
}))(TrashFolderView)
