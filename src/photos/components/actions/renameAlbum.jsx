import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ActionMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'

const renameAlbum = onRename => () => ({
  name: 'renameAlbum',
  action: onRename,
  Component: forwardRef(function RenameAlbum(props, ref) {
    const { t } = useI18n()
    return (
      <ActionMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={RenameIcon} />
        </ListItemIcon>
        <ListItemText primary={t('Toolbar.menu.rename_album')} />
      </ActionMenuItem>
    )
  })
})

export default renameAlbum
