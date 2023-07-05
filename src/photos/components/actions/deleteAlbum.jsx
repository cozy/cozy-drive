import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ActionMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'

const deleteAlbum = onDelete => () => ({
  name: 'deleteAlbum',
  action: onDelete,
  Component: forwardRef(function DeleteAlbum(props, ref) {
    const { t } = useI18n()
    return (
      <ActionMenuItem {...props} ref={ref} className="u-pomegranate">
        <ListItemIcon>
          <Icon icon={TrashIcon} color="var(--pomegranate)" />
        </ListItemIcon>
        <ListItemText primary={t('Toolbar.menu.album_delete')} />
      </ActionMenuItem>
    )
  })
})

export default deleteAlbum
