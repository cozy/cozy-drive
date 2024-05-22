import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery, useClient } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'
import flag from 'cozy-flags'

import { SHARED_DRIVES_DIR_ID } from 'constants/config'
import { useThumbnailSizeContext } from 'lib/ThumbnailSizeContext'
import { CozyFile } from 'models/index'
import { FileWithSelection as File } from 'modules/filelist/File'
import { FileList } from 'modules/filelist/FileList'
import FileListBody from 'modules/filelist/FileListBody'
import { FileListHeader } from 'modules/filelist/FileListHeader'
import { useFolderSort } from 'modules/navigation/duck'
import generateShortcutUrl from 'modules/views/Folder/generateShortcutUrl'
import { buildSharedDrivesQuery } from 'modules/views/Folder/queries/fetchSharedDrives'
import { UseSharedDrivesQuery } from 'modules/views/Folder/types'

interface SharedDrivesProps {
  canSort: boolean
}

export const SharedDrives = ({
  canSort
}: SharedDrivesProps): JSX.Element | null => {
  const { isBigThumbnail, toggleThumbnailSize } = useThumbnailSizeContext()
  const [sortOrder, setSortOrder] = useFolderSort(SHARED_DRIVES_DIR_ID)
  const client = useClient()
  const navigate = useNavigate()
  const changeSortOrder = useCallback(
    (folderId_legacy, attribute: string, order: string) =>
      setSortOrder({ attribute, order }),
    [setSortOrder]
  )

  const sharedDrivesQuery = buildSharedDrivesQuery({
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })
  const { data } = useQuery(
    sharedDrivesQuery.definition,
    sharedDrivesQuery.options
  ) as UseSharedDrivesQuery

  const handleFolderOpen = (): void => {
    // noop because we only display shortcuts
  }
  const handleFileOpen = ({ file }: { file: IOCozyFile }): void => {
    if (
      file.cozyMetadata?.createdByApp === 'nextcloud' &&
      flag('drive.show-nextcloud-dev')
    ) {
      navigate(`/nextcloud/${file._id}`)
    } else {
      const url = generateShortcutUrl({
        file,
        client,
        isFlatDomain: client?.capabilities.flat_subdomains,
        fromPublicFolder: false
      })
      window.open(url, '_blank')
    }
  }

  if (!data || data.length === 0) return null

  return (
    <FileList>
      <FileListHeader
        canSort={canSort}
        folderId={SHARED_DRIVES_DIR_ID}
        sort={sortOrder}
        onFolderSort={changeSortOrder}
        thumbnailSizeBig={isBigThumbnail}
        toggleThumbnailSize={toggleThumbnailSize}
      />
      <FileListBody>
        <div className="u-ov-hidden">
          <>
            {data.map(file => (
              <File
                key={file.id}
                attributes={{
                  ...file,
                  name: CozyFile.splitFilename(file).filename
                }}
                withSelectionCheckbox={false}
                onFolderOpen={handleFolderOpen}
                onFileOpen={handleFileOpen}
                isInSyncFromSharing={false}
                disableSelection={true}
                isExternal={file.class === 'shortcut'}
              />
            ))}
          </>
        </div>
      </FileListBody>
    </FileList>
  )
}
