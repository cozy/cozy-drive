import compose from 'lodash/flowRight'
import PropTypes from 'prop-types'
import React from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import deleteContainer from './delete'

import { SHARED_DRIVES_DIR_ID } from '@/constants/config'

const DeleteItem = ({ t, isSharedWithMe, trashFolder, displayedFolder }) => {
  const handleClick = () => {
    trashFolder(displayedFolder)
  }

  const isSharedDrive = displayedFolder.dir_id === SHARED_DRIVES_DIR_ID

  const label = isSharedWithMe
    ? t('toolbar.leave')
    : isSharedDrive
    ? t('toolbar.delete_shared_drive')
    : t('toolbar.trash')

  return (
    <ActionsMenuItem data-testid="fil-action-delete" onClick={handleClick}>
      <ListItemIcon>
        <Icon icon={TrashIcon} color="var(--errorColor)" />
      </ListItemIcon>
      <ListItemText style={{ color: 'var(--errorColor)' }} primary={label} />
    </ActionsMenuItem>
  )
}

DeleteItem.propTypes = {
  t: PropTypes.func.isRequired,
  isSharedWithMe: PropTypes.bool.isRequired,
  trashFolder: PropTypes.func.isRequired,
  displayedFolder: PropTypes.object.isRequired
}

export default compose(translate(), deleteContainer)(DeleteItem)
