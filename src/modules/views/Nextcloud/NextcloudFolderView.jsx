import React from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { NextcloudBanner } from '@/modules/nextcloud/components/NextcloudBanner'
import { NextcloudBreadcrumb } from '@/modules/nextcloud/components/NextcloudBreadcrumb'
import { NextcloudFolderBody } from '@/modules/nextcloud/components/NextcloudFolderBody'
import { NextcloudToolbar } from '@/modules/nextcloud/components/NextcloudToolbar'
import { useNextcloudFolder } from '@/modules/nextcloud/hooks/useNextcloudFolder'
import { useNextcloudPath } from '@/modules/nextcloud/hooks/useNextcloudPath'
import FolderView from '@/modules/views/Folder/FolderView'
import FolderViewHeader from '@/modules/views/Folder/FolderViewHeader'

const NextcloudFolderView = () => {
  const { sourceAccount } = useParams()
  const path = useNextcloudPath()
  const { t } = useI18n()

  const { nextcloudResult } = useNextcloudFolder({
    sourceAccount,
    path
  })

  var queryResults = [nextcloudResult]
  if (path === '/') {
    queryResults = [
      nextcloudResult,
      {
        id: 'io.cozy.remote.nextcloud.files.trash-dir',
        fetchStatus: nextcloudResult.fetchStatus,
        data:
          nextcloudResult.fetchStatus === 'loaded'
            ? [
                {
                  _id: 'io.cozy.remote.nextcloud.files.trash-dir',
                  type: 'directory',
                  name: t('NextcloudBreadcrumb.trash')
                }
              ]
            : []
      }
    ]
  }

  return (
    <FolderView>
      <FolderViewHeader>
        <NextcloudBreadcrumb sourceAccount={sourceAccount} path={path} />
        <NextcloudToolbar />
      </FolderViewHeader>
      <NextcloudBanner />
      <NextcloudFolderBody path={path} queryResults={queryResults} />
      <Outlet />
    </FolderView>
  )
}

export { NextcloudFolderView }
