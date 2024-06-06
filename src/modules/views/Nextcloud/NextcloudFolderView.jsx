import React from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { NextcloudBreadcrumb } from 'modules/nextcloud/components/NextcloudBreadcrumb'
import { NextcloudFolderBody } from 'modules/nextcloud/components/NextcloudFolderBody'
import { NextcloudToolbar } from 'modules/nextcloud/components/NextcloudToolbar'
import { useNextcloudFolder } from 'modules/nextcloud/hooks/useNextcloudFolder'
import { useNextcloudPath } from 'modules/nextcloud/hooks/useNextcloudPath'
import FolderView from 'modules/views/Folder/FolderView'
import FolderViewHeader from 'modules/views/Folder/FolderViewHeader'

const NextcloudFolderView = () => {
  const { shortcutId } = useParams()
  const path = useNextcloudPath()

  const { shortcutResult, nextcloudResult } = useNextcloudFolder({
    shortcutId,
    path
  })

  return (
    <FolderView>
      <FolderViewHeader>
        <NextcloudBreadcrumb shortcut={shortcutResult.data} path={path} />
        <NextcloudToolbar />
      </FolderViewHeader>
      <NextcloudFolderBody path={path} queryResults={[nextcloudResult]} />
      <Outlet />
    </FolderView>
  )
}

export { NextcloudFolderView }
