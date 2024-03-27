import React, { useState } from 'react'

import ListItem from 'cozy-ui/transpiled/react/ListItem'
import { NavLimiter } from 'cozy-ui/transpiled/react/NavLimiter'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FileWithSelection as File } from 'modules/filelist/File'
import { FileList } from 'modules/filelist/FileList'
import FileListBody from 'modules/filelist/FileListBody'
import { NavItem } from 'modules/navigation/NavItem'
import { useExtraDrive } from 'modules/views/Folder/hooks/useExtraDrive'

export const ExtraDrive = (): JSX.Element | null => {
  const { isMobile } = useBreakpoints()
  const files = useExtraDrive()
  const clickState = useState(null)
  const { t } = useI18n()

  if (!files) return null

  return isMobile ? (
    <FileList>
      <FileListBody>
        <div className="u-ov-hidden">
          <>
            {files.map(file => (
              <File
                key={file._id}
                attributes={file.attributes}
                withSelectionCheckbox={false}
                onFolderOpen={(): void => {
                  // noop
                }}
                onFileOpen={(): void => {
                  // noop
                }}
                actions={[]}
                isInSyncFromSharing={false}
                disableSelection={true}
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
            key={file._id}
            secondary
            to={file.path}
            label={file.attributes.name}
            clickState={clickState}
            external
          />
        ))}
      </NavLimiter>
    </ListItem>
  )
}
