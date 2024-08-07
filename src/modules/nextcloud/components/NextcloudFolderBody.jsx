import React from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { moveNextcloud } from './actions/moveNextcloud'
import { joinPath } from 'lib/path'
import { hr } from 'modules/actions'
import { duplicateTo } from 'modules/actions/components/duplicateTo'
import { FolderBody } from 'modules/folder/components/FolderBody'
import { deleteNextcloudFile } from 'modules/nextcloud/components/actions/deleteNextcloudFile'
import { downloadNextcloudFile } from 'modules/nextcloud/components/actions/downloadNextcloudFile'
import { openWithinNextcloud } from 'modules/nextcloud/components/actions/openWithinNextcloud'
import { rename } from 'modules/nextcloud/components/actions/rename'
import { shareNextcloudFile } from 'modules/nextcloud/components/actions/shareNextcloudFile'

const NextcloudFolderBody = ({ path, queryResults }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const client = useClient()
  const { t } = useI18n()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleFolderOpen = folder => {
    if (folder._id === 'io.cozy.remote.nextcloud.files.trash-dir') {
      navigate(`${pathname}/trash`)
    } else {
      searchParams.set('path', joinPath(path, folder.name))
      setSearchParams(searchParams)
    }
  }

  const handleFileOpen = ({ file }) => {
    window.open(file.links.self, '_blank')
  }

  const fileActions = makeActions(
    [
      shareNextcloudFile,
      downloadNextcloudFile,
      hr,
      rename,
      moveNextcloud,
      duplicateTo,
      openWithinNextcloud,
      hr,
      deleteNextcloudFile
    ],
    {
      t,
      client,
      pathname,
      navigate,
      search: searchParams.toString()
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
