import React from 'react'

import { useQuery } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { CozyFile } from 'models/index'
import { FileWithSelection as File } from 'modules/filelist/File'
import { FileList } from 'modules/filelist/FileList'
import FileListBody from 'modules/filelist/FileListBody'
import { buildSharedDrivesQuery } from 'modules/views/Folder/queries/fetchSharedDrives'
import { UseSharedDrivesQuery } from 'modules/views/Folder/types'

interface SharedDrivesProps {
  actions: unknown[]
  handleFileOpen?: (path: string) => void
  navigateToFolder: (path: string) => void
  isFlatDomain: boolean
}

export const SharedDrives = ({
  handleFileOpen,
  navigateToFolder
}: SharedDrivesProps): JSX.Element | null => {
  const { isMobile } = useBreakpoints()
  const sharedDrivesQuery = buildSharedDrivesQuery()
  const { data } = useQuery(
    sharedDrivesQuery.definition,
    sharedDrivesQuery.options
  ) as UseSharedDrivesQuery

  if (!data || data.length === 0) return null

  if (isMobile) {
    return (
      <FileList>
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
                  onFolderOpen={navigateToFolder}
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

  return null
}
