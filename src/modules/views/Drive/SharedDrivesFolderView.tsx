import React, { FC, useCallback, useMemo } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useClient, useQuery } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ROOT_DIR_ID } from 'constants/config'
import useDisplayedFolder from 'hooks/useDisplayedFolder'
import { addToFavorites } from 'modules/actions/components/addToFavorites'
import { removeFromFavorites } from 'modules/actions/components/removeFromFavorites'
import { makeExtraColumnsNamesFromMedia } from 'modules/certifications'
import {
  useExtraColumns,
  ExtraColumn
} from 'modules/certifications/useExtraColumns'
import { FolderBody } from 'modules/folder/components/FolderBody'
import { useFileOpeningHandler } from 'modules/folder/hooks/useFileOpeningHandler'
import { useFolderSort } from 'modules/navigation/duck'
import FolderView from 'modules/views/Folder/FolderView'
import FolderViewBreadcrumb from 'modules/views/Folder/FolderViewBreadcrumb'
import FolderViewHeader from 'modules/views/Folder/FolderViewHeader'
import {
  buildDriveQuery,
  buildFileWithSpecificMetadataAttributeQuery
} from 'queries'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames: string[] = []

const SharedDrivesFolderView: FC = () => {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const { isNotFound } = useDisplayedFolder()
  const client = useClient()
  const { showAlert } = useAlert()

  const extraColumnsNames = makeExtraColumnsNamesFromMedia({
    isMobile,
    desktopExtraColumnsNames,
    mobileExtraColumnsNames
  })

  const extraColumns = useExtraColumns({
    columnsNames: extraColumnsNames,
    queryBuilder: buildFileWithSpecificMetadataAttributeQuery,
    currentFolderId: 'io.cozy.files.shared-drives-dir'
  }) as ExtraColumn[]

  const [sortOrder] = useFolderSort('io.cozy.files.shared-drives-dir')

  const folderQuery = buildDriveQuery({
    currentFolderId: 'io.cozy.files.shared-drives-dir',
    type: 'directory',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })
  const fileQuery = buildDriveQuery({
    currentFolderId: 'io.cozy.files.shared-drives-dir',
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })

  const foldersResult = useQuery(folderQuery.definition, folderQuery.options)
  const filesResult = useQuery(fileQuery.definition, fileQuery.options)

  const queryResults = [foldersResult, filesResult]

  const handleFolderOpen = useCallback(
    (folder: IOCozyFile) => {
      navigate(`/folder/${folder._id}`)
    },
    [navigate]
  )

  const navigateToFile = useCallback(
    (file: IOCozyFile) => {
      navigate(`/folder/io.cozy.files.shared-drives-dir/file/${file._id}`)
    },
    [navigate]
  )

  const { handleFileOpen } = useFileOpeningHandler({
    isPublic: false,
    navigateToFile
  })

  const rootBreadcrumbPath = useMemo(
    () => ({
      id: ROOT_DIR_ID,
      name: t('breadcrumb.title_drive')
    }),
    [t]
  )

  const actionsOptions = {
    client,
    t,
    showAlert
  }

  const actions = makeActions(
    [addToFavorites, removeFromFavorites],
    actionsOptions
  )

  return (
    <FolderView isNotFound={isNotFound}>
      <FolderViewHeader>
        <FolderViewBreadcrumb
          rootBreadcrumbPath={rootBreadcrumbPath}
          currentFolderId="io.cozy.files.shared-drives-dir"
          navigateToFolder={handleFolderOpen}
        />
      </FolderViewHeader>
      <FolderBody
        folderId="io.cozy.files.shared-drives-dir"
        queryResults={queryResults}
        onFolderOpen={handleFolderOpen}
        onFileOpen={handleFileOpen}
        extraColumns={extraColumns}
        actions={actions}
      />
      <Outlet />
    </FolderView>
  )
}

export { SharedDrivesFolderView }
