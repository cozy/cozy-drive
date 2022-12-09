import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ActionMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import AlbumAddIcon from 'cozy-ui/transpiled/react/Icons/AlbumAdd'

const newAlbum = navigate => () => ({
  name: 'newAlbum',
  action: () => navigate('/albums/new'),
  Component: forwardRef(function NewAlbum(props, ref) {
    const { t } = useI18n()
    return (
      <ActionMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={AlbumAddIcon} />
        </ListItemIcon>
        <ListItemText primary={t('Toolbar.album_new')} />
      </ActionMenuItem>
    )
  })
})

export default newAlbum
