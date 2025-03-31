import React, { FC } from 'react'

import { splitFilename } from 'cozy-client/dist/models/file'
import type { IOCozyFile } from 'cozy-client/types/types'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Folder'
import { NavIcon, NavLink, NavItem } from 'cozy-ui/transpiled/react/Nav'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { FileLink } from './components/FileLink'

import ServerIcon from '@/assets/icons/icon-server.svg'
import { useFileLink } from '@/modules/navigation/hooks/useFileLink'
import { isNextcloudShortcut } from '@/modules/nextcloud/helpers'

interface FavoriteListItemProps {
  file: IOCozyFile
  clickState: [string, (value: string | undefined) => void]
}

const FavoriteListItem: FC<FavoriteListItemProps> = ({
  file,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clickState: [lastClicked, setLastClicked]
}) => {
  const { link } = useFileLink(file, { forceFolderPath: true })
  const { filename } = splitFilename(file)

  return (
    <NavItem key={file._id}>
      <FileLink
        link={link}
        className={NavLink.className}
        onClick={(): void => setLastClicked(undefined)}
      >
        <NavIcon
          icon={
            isNextcloudShortcut(file)
              ? ServerIcon
              : file.type === 'directory'
              ? FolderIcon
              : FileIcon
          }
        />
        <Typography variant="inherit" color="inherit" noWrap>
          {filename}
        </Typography>
      </FileLink>
    </NavItem>
  )
}

export { FavoriteListItem }
