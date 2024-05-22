import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useQuery } from 'cozy-client'

import { NextcloudBreadcrumb } from 'modules/nextcloud/components/NextcloudBreadcrumb'
import { NextcloudFolderBody } from 'modules/nextcloud/components/NextcloudFolderBody'
import { NextcloudToolbar } from 'modules/nextcloud/components/NextcloudToolbar'
import { buildNextcloudFolderQuery } from 'modules/nextcloud/queries'
import { buildFileByIdQuery } from 'modules/queries'
import FolderView from 'modules/views/Folder/FolderView'
import FolderViewHeader from 'modules/views/Folder/FolderViewHeader'

const NextcloudFolderView = () => {
  const { shorcutId } = useParams()
  const [searchParams] = useSearchParams()
  const path = searchParams.get('path') ?? '/'

  const shortcutQuery = buildFileByIdQuery(shorcutId)
  const shortcutResult = useQuery(
    shortcutQuery.definition,
    shortcutQuery.options
  )

  const sourceAccount = shortcutResult.data?.cozyMetadata?.sourceAccount

  const nextcloudQuery = buildNextcloudFolderQuery({
    sourceAccount,
    path
  })
  const nextcloudResult = useQuery(
    nextcloudQuery.definition,
    nextcloudQuery.options
  )

  return (
    <FolderView>
      <FolderViewHeader>
        <NextcloudBreadcrumb shortcut={shortcutResult.data} path={path} />
        <NextcloudToolbar />
      </FolderViewHeader>
      <NextcloudFolderBody path={path} queryResults={[nextcloudResult]} />
    </FolderView>
  )
}

export { NextcloudFolderView }
