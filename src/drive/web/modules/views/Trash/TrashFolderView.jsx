import React, { useCallback, useContext } from 'react'
import { connect } from 'react-redux'

import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'

import { useQuery, useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { SharingContext } from 'cozy-sharing'

import { useFolderSort } from 'drive/web/modules/navigation/duck'
import useActions from 'drive/web/modules/actions/useActions'
import { restore, destroy } from 'drive/web/modules/actions'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import { buildTrashQuery } from 'drive/web/modules/queries'
import { getCurrentFolderId } from 'drive/web/modules/selectors'
import { ModalContext } from 'drive/lib/ModalContext'
import TrashToolbar from 'drive/web/modules/trash/Toolbar'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'

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
  const folderQuery = buildTrashQuery({
    currentFolderId,
    type: 'directory',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })
  const fileQuery = buildTrashQuery({
    currentFolderId,
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order,
    limit: 50
  })

  const foldersResult = useQuery(folderQuery.definition, folderQuery.options)
  const filesResult = useQuery(fileQuery.definition, fileQuery.options)

  const navigateToFolder = useCallback(folderId => {
    router.push(`/trash/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/trash/${currentFolderId}/file/${file.id}`)
  })

  const { refresh } = useContext(SharingContext)
  const client = useClient()
  const { pushModal, popModal } = useContext(ModalContext)
  const actionsOptions = {
    client,
    refresh,
    pushModal,
    popModal
  }
  const actions = useActions([restore, destroy], actionsOptions)

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
        currentFolderId={currentFolderId}
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
