import React, { FC } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { NextcloudFile, UseQueryReturnValue } from 'cozy-client/types/types'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FolderBody } from 'modules/folder/components/FolderBody'
import { restoreNextcloudFile } from 'modules/nextcloud/components/actions/restoreNextcloudFile'

interface NextcloudTrashFolderBodyProps {
  path: string
  queryResults: UseQueryReturnValue[]
}

const NextcloudTrashFolderBody: FC<NextcloudTrashFolderBodyProps> = ({
  path,
  queryResults
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const client = useClient()
  const { t } = useI18n()
  const { showAlert } = useAlert()

  const handleFolderOpen = (folder: NextcloudFile): void => {
    searchParams.set('path', folder.path)
    setSearchParams(searchParams)
  }

  const handleFileOpen = ({ file }: { file: NextcloudFile }): void => {
    window.open(file.links.self, '_blank')
  }

  const fileActions = makeActions([restoreNextcloudFile], {
    t,
    client,
    showAlert
  })

  return (
    <FolderBody
      folderId={path}
      queryResults={queryResults}
      actions={fileActions}
      onFolderOpen={handleFolderOpen}
      onFileOpen={handleFileOpen}
      withFilePath={false}
      extraColumns={[]}
    />
  )
}

export { NextcloudTrashFolderBody }
