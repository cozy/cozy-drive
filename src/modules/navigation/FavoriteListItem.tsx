import React, { FC } from 'react'

import { splitFilename, isDirectory } from 'cozy-client/dist/models/file'
import type { IOCozyFile } from 'cozy-client/types/types'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import FileTypeServerIcon from 'cozy-ui/transpiled/react/Icons/FileTypeServer'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Folder'
import { NavIcon, NavLink, NavItem } from 'cozy-ui/transpiled/react/Nav'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { FileLink } from './components/FileLink'

import { useFileLink } from '@/modules/navigation/hooks/useFileLink'
import { isNextcloudShortcut } from '@/modules/nextcloud/helpers'

interface FavoriteListItemProps {
  file: IOCozyFile
  clickState: [string, (value: string | undefined) => void]
}

const makeIcon = (file: IOCozyFile): string | React.ComponentType =>
  isNextcloudShortcut(file)
    ? FileTypeServerIcon
    : isDirectory(file)
    ? FolderIcon
    : FileIcon

const FavoriteListItem: FC<FavoriteListItemProps> = ({
  file,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clickState: [lastClicked, setLastClicked]
}) => {
  const { link } = useFileLink(file, { forceFolderPath: true })
  const { filename } = splitFilename(file)

  const Icon = makeIcon(file)

  return (
    <NavItem key={file._id}>
      <FileLink
        link={link}
        className={NavLink.className}
        onClick={(): void => setLastClicked(undefined)}
      >
        <NavIcon icon={Icon} />
        <Typography variant="inherit" color="inherit" noWrap>
          {filename}
        </Typography>
      </FileLink>
    </NavItem>
  )
}

export { FavoriteListItem }
