import React, { useState } from 'react'

import { useClient, useQuery } from 'cozy-client'
import { NavDesktopLimiter } from 'cozy-ui/transpiled/react/Nav'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import generateShortcutUrl from './generateShortcutUrl'
import { buildSharedDrivesQuery } from './queries/fetchSharedDrives'
import { FileWithSelection as File } from 'modules/filelist/File'
import { FileList } from 'modules/filelist/FileList'
import FileListBody from 'modules/filelist/FileListBody'
import { NavItem } from 'modules/navigation/NavItem'
import { UseSharedDrivesQuery } from 'modules/views/Folder/types'

interface SharedDrivesProps {
  actions: unknown[]
  handleFileOpen?: (path: string) => void
  navigateToFolder: (path: string) => void
  isFlatDomain: boolean
}

export const SharedDrives = ({
  handleFileOpen,
  navigateToFolder,
  isFlatDomain
}: SharedDrivesProps): JSX.Element | null => {
  const { isMobile } = useBreakpoints()
  const sharedDrivesQuery = buildSharedDrivesQuery()
  const { data } = useQuery(
    sharedDrivesQuery.definition,
    sharedDrivesQuery.options
  ) as UseSharedDrivesQuery
  const clickState = useState(null)
  const { t } = useI18n()
  const client = useClient()

  if (!data || data.length === 0) return null

  return isMobile ? (
    <FileList>
      <FileListBody>
        <div className="u-ov-hidden">
          <>
            {data.map(file => (
              <File
                key={file.id}
                attributes={file}
                withSelectionCheckbox={false}
                onFolderOpen={navigateToFolder}
                onFileOpen={handleFileOpen}
                isInSyncFromSharing={false}
                disableSelection={true}
                isSharedDrives={true}
              />
            ))}
          </>
        </div>
      </FileListBody>
    </FileList>
  ) : (
    <NavDesktopLimiter
      className="u-p-0"
      showMoreString={t('Nav.view_more')}
      showLessString={t('Nav.view_less')}
    >
      {data.map(file => (
        <NavItem
          key={file._id}
          secondary
          forcedLabel={file.name} // We don't want to display the .url extension
          clickState={clickState}
          sharedDrives={true}
          onClick={(): void => {
            const url = generateShortcutUrl({
              file,
              client,
              isFlatDomain,
              fromPublicFolder: false
            })
            window.open(url, '_blank')
          }}
        />
      ))}
    </NavDesktopLimiter>
  )
}
