import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FolderBody } from 'modules/folder/components/FolderBody'
import { downloadNextcloudFile } from 'modules/nextcloud/components/actions/downloadNextcloudFile'
import { openWithinNextcloud } from 'modules/nextcloud/components/actions/openWithinNextcloud'
import { makePath } from 'modules/nextcloud/utils'

const NextcloudFolderBody = ({ path, queryResults }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const client = useClient()
  const { t } = useI18n()

  const handleFolderOpen = folder => {
    searchParams.set('path', makePath(path, folder.name))
    setSearchParams(searchParams)
  }

  const handleFileOpen = ({ file }) => {
    window.open(file.links.self, '_blank')
  }

  const fileActions = makeActions(
    [downloadNextcloudFile, openWithinNextcloud],
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
