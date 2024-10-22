import React, { FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery } from 'cozy-client'
import { splitFilename } from 'cozy-client/dist/models/file'
import { IOCozyFile } from 'cozy-client/types/types'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Folder'
import List from 'cozy-ui/transpiled/react/List'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import { NavIcon, NavLink, NavItem } from 'cozy-ui/transpiled/react/Nav'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ServerIcon from 'assets/icons/icon-server.svg'
import { useFileOpeningHandler } from 'modules/folder/hooks/useFileOpeningHandler'
import { buildFavoritesQuery } from 'queries'

interface FavoriteListProps {
  className?: string
}

const FavoriteList: FC<FavoriteListProps> = ({ className }) => {
  const { t } = useI18n()
  const favoritesQuery = buildFavoritesQuery({
    sortAttribute: 'name',
    sortOrder: 'desc'
  })
  const favoritesResult = useQuery(
    favoritesQuery.definition,
    favoritesQuery.options
  ) as {
    data?: IOCozyFile[] | null
  }
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

  if (favoritesResult.data && favoritesResult.data.length > 0) {
    return (
      <List
        subheader={<ListSubheader>{t('Nav.item_favorites')}</ListSubheader>}
        className={className}
      >
        {favoritesResult.data.map(file => {
          const { filename } = splitFilename(file)
          const isNextcloudShortcut =
            file.cozyMetadata?.createdByApp === 'nextcloud'

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
                    isNextcloudShortcut
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
        })}
      </List>
    )
  }

  return null
}

export { FavoriteList }
