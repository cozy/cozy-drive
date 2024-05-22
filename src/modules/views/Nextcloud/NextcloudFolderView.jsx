import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useQuery } from 'cozy-client'
import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { NextcloudBreadcrumb } from 'modules/nextcloud/components/NextcloudBreadcrumb'
import { NextcloudToolbar } from 'modules/nextcloud/components/NextcloudToolbar'
import { downloadNextcloudFile } from 'modules/nextcloud/components/actions/downloadNextcloudFile'
import { openWithinNextcloud } from 'modules/nextcloud/components/actions/openWithinNextcloud'
import { buildNextcloudFolderQuery } from 'modules/nextcloud/queries'
import { makePath } from 'modules/nextcloud/utils'
import { buildFileByIdQuery } from 'modules/queries'
import FolderView from 'modules/views/Folder/FolderView'
import FolderViewBody from 'modules/views/Folder/FolderViewBody'
import FolderViewHeader from 'modules/views/Folder/FolderViewHeader'

const NextcloudFolderView = () => {
  const { t } = useI18n()
  const { shorcutId } = useParams()
  const client = useClient()
  const [searchParams, setSearchParams] = useSearchParams()
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

  const handleNavigateToFolder = folder => {
    searchParams.set('path', makePath(path, folder.name))
    setSearchParams(searchParams)
  }

  const toolbarActions = makeActions([openWithinNextcloud], {
    t,
    client
  })

  const fileActions = makeActions(
    [downloadNextcloudFile, openWithinNextcloud],
    {
      t,
      client
    }
  )

  return (
    <FolderView>
      <FolderViewHeader>
        <NextcloudBreadcrumb shortcut={shortcutResult.data} path={path} />
        <NextcloudToolbar actions={toolbarActions} docs={[]} />
      </FolderViewHeader>
      <FolderViewBody
        queryResults={[nextcloudResult]}
        actions={fileActions}
        navigateToFolder={handleNavigateToFolder}
      />
    </FolderView>
  )
}

export { NextcloudFolderView }
