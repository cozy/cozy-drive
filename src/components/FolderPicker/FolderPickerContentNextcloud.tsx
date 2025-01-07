import React from 'react'

import { useQuery } from 'cozy-client'
import { isDirectory } from 'cozy-client/dist/models/file'
import { NextcloudFile } from 'cozy-client/types/types'
import List from 'cozy-ui/transpiled/react/List'

import { FolderPickerListItem } from './FolderPickerListItem'

import { FolderPickerContentLoader } from '@/components/FolderPicker/FolderPickerContentLoader'
import { isInvalidMoveTarget } from '@/components/FolderPicker/helpers'
import type { File, FolderPickerEntry } from '@/components/FolderPicker/types'
import { buildNextcloudFolderQuery } from '@/queries'

interface Props {
  folder: NextcloudFile
  entries: FolderPickerEntry[] // Update with the appropriate type
  navigateTo: (folder: import('./types').File) => void // Update with the appropriate type
}

const FolderPickerContentNextcloud: React.FC<Props> = ({
  folder,
  entries,
  navigateTo
}) => {
  const nextcloudQuery = buildNextcloudFolderQuery({
    sourceAccount: folder.cozyMetadata.sourceAccount,
    path: folder.path
  })

  const { fetchStatus, data } = useQuery(
    nextcloudQuery.definition,
    nextcloudQuery.options
  ) as {
    fetchStatus: string
    data?: NextcloudFile[]
  }

  const files = data ?? []

  const handleClick = (file: File): void => {
    if (isDirectory(file)) {
      navigateTo(file)
    }
  }

  return (
    <List>
      <FolderPickerContentLoader
        fetchStatus={fetchStatus}
        hasNoData={files.length === 0}
      >
        {files.map((file, index) => (
          <FolderPickerListItem
            key={file._id}
            file={file}
            disabled={isInvalidMoveTarget(entries, file)}
            onClick={handleClick}
            showDivider={index !== files.length - 1}
          />
        ))}
      </FolderPickerContentLoader>
    </List>
  )
}

export { FolderPickerContentNextcloud }
