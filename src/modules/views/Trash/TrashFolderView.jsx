import { useCurrentFolderId, useDisplayedFolder } from 'hooks'
import React, { useCallback, useMemo } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'

import { useQuery, useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import useHead from 'components/useHead'
import { TRASH_DIR_ID } from 'constants/config'
import { useModalContext } from 'lib/ModalContext'
import { restore, destroy } from 'modules/actions'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import { useExtraColumns } from 'modules/certifications/useExtraColumns'
import { useFolderSort } from 'modules/navigation/duck'
import {
  buildTrashQuery,
  buildFileWithSpecificMetadataAttributeQuery
} from 'modules/queries'
import TrashToolbar from 'modules/trash/Toolbar'

import FolderView from '../Folder/FolderView'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewBreadcrumb from '../Folder/FolderViewBreadcrumb'
import FolderViewHeader from '../Folder/FolderViewHeader'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

export const TrashFolderView = () => {
  const { isMobile } = useBreakpoints()
  const navigate = useNavigate()
  const currentFolderId = useCurrentFolderId()
  const { t } = useI18n()
  const { refresh } = useSharingContext()
  const client = useClient()
  const { pushModal, popModal } = useModalContext()
  useHead()

  const { displayedFolder, isNotFound } = useDisplayedFolder()

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

  const actionsOptions = {
    client,
    t,
    refresh,
    pushModal,
    popModal
  }
  const actions = makeActions([restore, destroy], actionsOptions)

  const rootBreadcrumbPath = useMemo(
    () => ({
      id: TRASH_DIR_ID,
      name: t('breadcrumb.title_trash')
    }),
    [t]
  )

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

export default TrashFolderView
