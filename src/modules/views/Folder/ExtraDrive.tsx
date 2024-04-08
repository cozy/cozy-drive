import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import { NavLimiter } from 'cozy-ui/transpiled/react/NavLimiter'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import generateShortcutUrl from './generateShortcutUrl'
import { FileWithSelection as File } from 'modules/filelist/File'
import { FileList } from 'modules/filelist/FileList'
import FileListBody from 'modules/filelist/FileListBody'
import { NavItem } from 'modules/navigation/NavItem'
import { useExtraDrive } from 'modules/views/Folder/hooks/useExtraDrive'

interface ExtraDriveProps {
  actions: unknown[]
  handleFileOpen?: (path: string) => void
  navigateToFolder: (path: string) => void
  isFlatDomain: boolean
}

export const ExtraDrive = ({
  handleFileOpen,
  navigateToFolder,
  isFlatDomain
}: ExtraDriveProps): JSX.Element | null => {
  const { isMobile } = useBreakpoints()
  const files = useExtraDrive()
  const clickState = useState(null)
  const { t } = useI18n()
  const client = useClient()

  if (files.length === 0) return null

  return isMobile ? (
    <FileList>
      <FileListBody>
        <div className="u-ov-hidden">
          <>
            {files.map(file => (
              <File
                key={file.id}
                attributes={file}
                withSelectionCheckbox={false}
                onFolderOpen={navigateToFolder}
                onFileOpen={handleFileOpen}
                isInSyncFromSharing={false}
                disableSelection={true}
                isExternalDrive={true}
              />
            ))}
          </>
        </div>
      </FileListBody>
    </FileList>
  ) : (
    <ListItem className="u-p-0">
      <NavLimiter
        showMoreString={t('Nav.view_more')}
        showLessString={t('Nav.view_less')}
      >
        {files.map(file => (
          <NavItem
            key={file.id}
            secondary
            forcedLabel={file.name}
            clickState={clickState}
            external={file.attributes?.class === 'shortcut'}
            onClick={(): void => {
              const url = generateShortcutUrl({ file, client, isFlatDomain })
              window.open(url, '_blank')
            }}
          />
        ))}
      </NavLimiter>
    </ListItem>
  )
}
