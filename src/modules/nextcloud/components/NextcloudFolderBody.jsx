import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { duplicateNextcloudFile } from './actions/duplicateNextcloudFile'
import { joinPath } from 'lib/path'
import { hr } from 'modules/actions'
import { FolderBody } from 'modules/folder/components/FolderBody'
import { downloadNextcloudFile } from 'modules/nextcloud/components/actions/downloadNextcloudFile'
import { move } from 'modules/nextcloud/components/actions/move'
import { openWithinNextcloud } from 'modules/nextcloud/components/actions/openWithinNextcloud'
import { rename } from 'modules/nextcloud/components/actions/rename'
import { share } from 'modules/nextcloud/components/actions/share'
import { trash } from 'modules/nextcloud/components/actions/trash'

const NextcloudFolderBody = ({ path, queryResults }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const client = useClient()
  const { t } = useI18n()

  const handleFolderOpen = folder => {
    searchParams.set('path', joinPath(path, folder.name))
    setSearchParams(searchParams)
  }

  const handleFileOpen = ({ file }) => {
    window.open(file.links.self, '_blank')
  }

  const fileActions = makeActions(
    [
      share,
      downloadNextcloudFile,
      hr,
      rename,
      move,
      duplicateNextcloudFile,
      openWithinNextcloud,
      hr,
      trash
    ],
    {
      t,
      client
    }
  )

  return (
    <FolderBody
      folderId={path}
      queryResults={queryResults}
      actions={fileActions}
      onFolderOpen={handleFolderOpen}
      onFileOpen={handleFileOpen}
      withFilePath={false}
    />
  )
}

export { NextcloudFolderBody }
