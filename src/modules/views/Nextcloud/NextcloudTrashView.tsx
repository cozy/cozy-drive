import React, { FC } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { NextcloudBanner } from '@/modules/nextcloud/components/NextcloudBanner'
import { NextcloudBreadcrumb } from '@/modules/nextcloud/components/NextcloudBreadcrumb'
import { NextcloudTrashFolderBody } from '@/modules/nextcloud/components/NextcloudTrashFolderBody'
import { useNextcloudFolder } from '@/modules/nextcloud/hooks/useNextcloudFolder'
import { useNextcloudPath } from '@/modules/nextcloud/hooks/useNextcloudPath'
import { TrashToolbar } from '@/modules/trash/components/TrashToolbar'
import FolderView from '@/modules/views/Folder/FolderView'
import FolderViewHeader from '@/modules/views/Folder/FolderViewHeader'

const NextcloudTrashView: FC = () => {
  const { sourceAccount } = useParams()
  const path = useNextcloudPath({
    insideTrash: true
  })

  const { nextcloudResult } = useNextcloudFolder({
    sourceAccount,
    path,
    insideTrash: true
  })

  return (
    <FolderView isNotFound={false}>
      <FolderViewHeader>
        <NextcloudBreadcrumb sourceAccount={sourceAccount} path={path} />
        <TrashToolbar />
      </FolderViewHeader>
      <NextcloudBanner />
      <NextcloudTrashFolderBody path={path} queryResults={[nextcloudResult]} />
      <Outlet />
    </FolderView>
  )
}

export { NextcloudTrashView }
