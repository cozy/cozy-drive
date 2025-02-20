import React, { FC, useState, useMemo } from 'react'
import { Outlet } from 'react-router-dom'

import { useQuery } from 'cozy-client'
import flag from 'cozy-flags'
import { SharedDriveModal } from 'cozy-sharing'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ROOT_DIR_ID } from '@/constants/config'
import useDisplayedFolder from '@/hooks/useDisplayedFolder'
import { makeExtraColumnsNamesFromMedia } from '@/modules/certifications'
import {
  useExtraColumns,
  ExtraColumn
} from '@/modules/certifications/useExtraColumns'
import { FolderBody } from '@/modules/folder/components/FolderBody'
import { useFolderSort } from '@/modules/navigation/duck'
import AddSharedDriveButton from '@/modules/shareddrives/components/AddSharedDriveButton'
import AddSharedDriveFab from '@/modules/shareddrives/components/AddSharedDriveFab'
import FolderView from '@/modules/views/Folder/FolderView'
import FolderViewBreadcrumb from '@/modules/views/Folder/FolderViewBreadcrumb'
import FolderViewHeader from '@/modules/views/Folder/FolderViewHeader'
import {
  buildDriveQuery,
  buildFileWithSpecificMetadataAttributeQuery
} from '@/queries'

const desktopExtraColumnsNames = ['carbonCopy', 'electronicSafe']
const mobileExtraColumnsNames: string[] = []

const SharedDrivesFolderView: FC = () => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const { isNotFound } = useDisplayedFolder()
  const [isSharedDriveModalOpen, setIsSharedDriveModalOpen] = useState(false)

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

  const rootBreadcrumbPath = useMemo(
    () => ({
      id: ROOT_DIR_ID,
      name: t('breadcrumb.title_drive')
    }),
    [t]
  )

  const showSharedDriveModal = (): void => setIsSharedDriveModalOpen(true)
  const hideSharedDriveModal = (): void => setIsSharedDriveModalOpen(false)

  const showAddSharedDriveButton =
    flag('drive.shared-drive.enabled') && !isMobile
  const showAddSharedDriveFab = flag('drive.shared-drive.enabled') && isMobile

  return (
    <FolderView isNotFound={isNotFound}>
      <FolderViewHeader>
        <FolderViewBreadcrumb
          rootBreadcrumbPath={rootBreadcrumbPath}
          currentFolderId="io.cozy.files.shared-drives-dir"
        />
        {showAddSharedDriveButton && (
          <AddSharedDriveButton onClick={showSharedDriveModal} />
        )}
      </FolderViewHeader>
      <FolderBody
        folderId="io.cozy.files.shared-drives-dir"
        queryResults={queryResults}
        extraColumns={extraColumns}
      />
      {showAddSharedDriveFab && (
        <AddSharedDriveFab onClick={showSharedDriveModal} />
      )}
      {isSharedDriveModalOpen && (
        <SharedDriveModal onClose={hideSharedDriveModal} />
      )}
      <Outlet />
    </FolderView>
  )
}

export { SharedDrivesFolderView }
