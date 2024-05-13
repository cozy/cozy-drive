import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useQuery } from 'cozy-client'

import { NextcloudBreadcrumb } from 'modules/nextcloud/components/NextcloudBreadcrumb'
import { NextcloudToolbar } from 'modules/nextcloud/components/NextcloudToolbar'
import { buildNextcloudFolderQuery } from 'modules/nextcloud/queries'
import { buildFileByIdQuery } from 'modules/queries'
import FolderView from 'modules/views/Folder/FolderView'
import FolderViewBody from 'modules/views/Folder/FolderViewBody'
import FolderViewHeader from 'modules/views/Folder/FolderViewHeader'

const NextcloudFolderView = () => {
  const { shorcutId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const path = searchParams.get('path') ?? '/'

  const shortcutQuery = buildFileByIdQuery(shorcutId)
  const shortcutResult = useQuery(
    shortcutQuery.definition,
    shortcutQuery.options
  )

  const nextcloudQuery = buildNextcloudFolderQuery({
    sourceAccount: shortcutResult.data?.cozyMetadata?.sourceAccount,
    path
  })
  const nextcloudResult = useQuery(
    nextcloudQuery.definition,
    nextcloudQuery.options
  )

  const handleNavigateToFolder = folder => {
    searchParams.set(
      'path',
      `${path}${path.endsWith('/') ? '' : '/'}${folder.name}`
    )
    setSearchParams(searchParams)
  }

  const toolbarActions = []

  return (
    <FolderView>
      <FolderViewHeader>
        <NextcloudBreadcrumb shortcut={shortcutResult.data} path={path} />
        <NextcloudToolbar actions={toolbarActions} docs={[]} />
      </FolderViewHeader>
      <FolderViewBody
        queryResults={[nextcloudResult]}
        actions={[]}
        navigateToFolder={handleNavigateToFolder}
      />
    </FolderView>
  )
}

export { NextcloudFolderView }
