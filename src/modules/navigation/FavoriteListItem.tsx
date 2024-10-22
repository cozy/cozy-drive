import React, { FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { splitFilename } from 'cozy-client/dist/models/file'
import type { IOCozyFile } from 'cozy-client/types/types'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Folder'
import { NavIcon, NavLink, NavItem } from 'cozy-ui/transpiled/react/Nav'
import Typography from 'cozy-ui/transpiled/react/Typography'

import ServerIcon from 'assets/icons/icon-server.svg'
import { useFileOpeningHandler } from 'modules/folder/hooks/useFileOpeningHandler'
import { isNextcloudShortcut } from 'modules/nextcloud/helpers'

interface FavoriteListItemProps {
  file: IOCozyFile
}

const FavoriteListItem: FC<FavoriteListItemProps> = ({ file }) => {
  const navigate = useNavigate()

  const navigateToFile = useCallback(
    (file: IOCozyFile) => {
      if (file.type === 'directory') {
        navigate(`/folder/${file._id}`)
      } else {
        navigate(`/folder/${file.dir_id}/file/${file._id}`)
      }
    },
    [navigate]
  )
  const { handleFileOpen } = useFileOpeningHandler({
    isPublic: false,
    navigateToFile
  })

  const { filename } = splitFilename(file)

  const handleClick = async (
    event: React.MouseEvent<HTMLInputElement>
  ): Promise<void> => {
    event.preventDefault()
    await handleFileOpen({ event, file })
  }

  return (
    <NavItem key={file._id}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <div className={NavLink.className} onClick={handleClick}>
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
      </div>
    </NavItem>
  )
}

export { FavoriteListItem }
