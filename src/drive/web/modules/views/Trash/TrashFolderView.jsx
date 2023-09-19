import React, { useCallback, useContext, useMemo } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'

import { useQuery, useClient } from 'cozy-client'
import { SharingContext } from 'cozy-sharing'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useFolderSort } from 'drive/web/modules/navigation/duck'
import useActions from 'drive/web/modules/actions/useActions'
import { restore, destroy } from 'drive/web/modules/actions'
import { TRASH_DIR_ID } from 'drive/constants/config'
import {
  buildTrashQuery,
  buildFileWithSpecificMetadataAttributeQuery,
  buildOnlyFolderQuery
} from 'drive/web/modules/queries'
import { useCurrentFolderId } from 'drive/hooks'
import { ModalContext } from 'drive/lib/ModalContext'
import TrashToolbar from 'drive/web/modules/trash/Toolbar'
import { useExtraColumns } from 'drive/web/modules/certifications/useExtraColumns'
import { makeExtraColumnsNamesFromMedia } from 'drive/web/modules/certifications'

import FolderView from '../Folder/FolderView'
import FolderViewHeader from '../Folder/FolderViewHeader'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'
import useHead from 'components/useHead'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

export const TrashFolderView = ({ currentFolderId }) => {
  const { isMobile } = useBreakpoints()
  const navigate = useNavigate()

  useHead()
  const displayedFolderQuery = buildOnlyFolderQuery(currentFolderId)
  const displayedFolder = useQuery(displayedFolderQuery.definition, {
    ...displayedFolderQuery.options,
    enabled: !!currentFolderId
  }).data
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

  const navigateToFolder = useCallback(
    folderId => {
      navigate(`/trash/${folderId}`)
    },
    [navigate]
  )

  const navigateToFile = useCallback(
    file => {
      navigate(`/trash/${currentFolderId}/file/${file.id}`)
    },
    [navigate, currentFolderId]
  )

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
  const rootBreadcrumbPath = useMemo(
    () => ({
      id: TRASH_DIR_ID,
      name: t('breadcrumb.title_trash')
    }),
    [t]
  )

  return (
    <FolderView>
      <FolderViewHeader>
        {currentFolderId && (
          <FolderViewBreadcrumb
            rootBreadcrumbPath={rootBreadcrumbPath}
            currentFolderId={currentFolderId}
            navigateToFolder={navigateToFolder}
          />
        )}
        <TrashToolbar />
      </FolderViewHeader>
      <FolderViewBody
        currentFolderId={currentFolderId}
        displayedFolder={displayedFolder}
        navigateToFolder={navigateToFolder}
        navigateToFile={navigateToFile}
        actions={actions}
        queryResults={[foldersResult, filesResult]}
        canSort
        extraColumns={extraColumns}
      />
      <Outlet />
    </FolderView>
  )
}

const TrashFolderViewWrapper = () => {
  const currentFolderId = useCurrentFolderId()

  // Since playing with qDef.options.enabled is not enought
  // at the moment. See https://github.com/cozy/cozy-client/pull/1273
  if (!currentFolderId) return null
  return <TrashFolderView currentFolderId={currentFolderId} />
}
export default TrashFolderViewWrapper
