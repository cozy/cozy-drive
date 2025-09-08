import React, { FC } from 'react'

import { splitFilename } from 'cozy-client/dist/models/file'
import type { IOCozyFile } from 'cozy-client/types/types'
import FileTypeServerIcon from 'cozy-ui/transpiled/react/Icons/FileTypeServer'
import { NavIcon, NavLink, NavItem } from 'cozy-ui/transpiled/react/Nav'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { FileLink } from './FileLink'

import { useFileLink } from '@/modules/navigation/hooks/useFileLink'

interface ExternalDriveListItemProps {
  file: IOCozyFile
  setLastClicked: (value: string | undefined) => void
}

const ExternalDriveListItem: FC<ExternalDriveListItemProps> = ({
  file,
  setLastClicked
}) => {
  const { link } = useFileLink(file, { forceFolderPath: false })
  const { filename } = splitFilename(file)

  return (
    <NavItem key={file._id}>
      <FileLink
        link={link}
        className={NavLink.className}
        onClick={(): void => setLastClicked(undefined)}
      >
        <NavIcon icon={FileTypeServerIcon} />
        <Typography variant="inherit" color="inherit" noWrap>
          {filename}
        </Typography>
      </FileLink>
    </NavItem>
  )
}

export { ExternalDriveListItem }
