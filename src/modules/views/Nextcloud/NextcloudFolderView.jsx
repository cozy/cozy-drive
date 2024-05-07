import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useQuery } from 'cozy-client'

import { buildNextcloudFolderQuery } from 'modules/nextcloud/queries'
import { buildFileByIdQuery } from 'modules/queries'
import FolderView from 'modules/views/Folder/FolderView'
import FolderViewBody from 'modules/views/Folder/FolderViewBody'

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

  return (
    <FolderView>
      <FolderViewBody
        queryResults={[nextcloudResult]}
        actions={[]}
        navigateToFolder={handleNavigateToFolder}
      />
    </FolderView>
  )
}

export { NextcloudFolderView }
