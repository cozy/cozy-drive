import React from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'

import { useQuery, useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import FolderView from '../Folder/FolderView'
import FolderViewBody from '../Folder/FolderViewBody'
import FolderViewHeader from '../Folder/FolderViewHeader'

import useHead from '@/components/useHead'
import { useCurrentFolderId, useDisplayedFolder } from '@/hooks'
import { restore } from '@/modules/actions'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import AddMenuProvider from '@/modules/drive/AddMenu/AddMenuProvider'
import FabWithAddMenuContext from '@/modules/drive/FabWithAddMenuContext'
import { makeExtraColumnsNamesFromMedia } from '@/modules/certifications'
import { useExtraColumns } from '@/modules/certifications/useExtraColumns'
import { useFolderSort } from '@/modules/navigation/duck'
import { TrashBreadcrumb } from '@/modules/trash/components/TrashBreadcrumb'
import { TrashToolbar } from '@/modules/trash/components/TrashToolbar'
import { destroy } from '@/modules/trash/components/actions/destroy'
import {
  buildTrashQuery,
  buildFileWithSpecificMetadataAttributeQuery
} from '@/queries'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames = []

export const TrashFolderView = () => {
  const { isMobile } = useBreakpoints()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isSelectionBarVisible } = useSelectionContext()
  const currentFolderId = useCurrentFolderId()
  const { t } = useI18n()
  const { refresh } = useSharingContext()
  const client = useClient()
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

  const actions = makeActions([restore, destroy], {
    client,
    t,
    refresh,
    navigate,
    pathname
  })

  return (
    <FolderView isNotFound={isNotFound}>
      <Content className={isMobile ? '' : 'u-pt-1'}>
        <FolderViewHeader>
          <TrashBreadcrumb currentFolderId={currentFolderId} />
          <TrashToolbar />
        </FolderViewHeader>
        <FolderViewBody
          currentFolderId={currentFolderId}
          displayedFolder={displayedFolder}
          actions={actions}
          queryResults={[foldersResult, filesResult]}
          canSort
          extraColumns={extraColumns}
        />
        <Outlet />
        {isMobile && (
          <AddMenuProvider
            canCreateFolder={true}
            canUpload={true}
            disabled={false}
            displayedFolder={displayedFolder}
            isSelectionBarVisible={isSelectionBarVisible}
            isPublic={false}
            refreshFolderContent={() => {}}
          >
            <FabWithAddMenuContext noSidebar={false} />
          </AddMenuProvider>
        )}
      </Content>
    </FolderView>
  )
}

export default TrashFolderView
