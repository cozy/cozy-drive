import compose from 'lodash/flowRight'
import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import deleteContainer from './delete'

const DeleteItem = ({ t, isSharedWithMe, trashFolder, displayedFolder }) => {
  const handleClick = () => {
    trashFolder(displayedFolder)
  }

  const label = isSharedWithMe ? t('toolbar.leave') : t('toolbar.trash')

  return (
    <ActionMenuItem
      data-testid="fil-action-delete"
      left={<Icon icon={TrashIcon} color="var(--errorColor)" />}
      onClick={handleClick}
    >
      <span className="u-pomegranate">{label}</span>
    </ActionMenuItem>
  )
}

DeleteItem.propTypes = {
  t: PropTypes.func.isRequired,
  isSharedWithMe: PropTypes.bool.isRequired,
  trashFolder: PropTypes.func.isRequired,
  displayedFolder: PropTypes.object.isRequired
}

export default compose(translate(), deleteContainer)(DeleteItem)
