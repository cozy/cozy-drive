import React from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/flowRight'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'

import deleteContainer from './delete'

const DeleteItem = ({
  t,
  isSharedWithMe,
  displayedFolder,
  trashFolder,
  onLeave
}) =>
  isSharedWithMe ? (
    <ActionMenuItem
      data-testid="fil-action-delete"
      left={<Icon icon={TrashIcon} color="var(--errorColor)" />}
      onClick={() =>
        onLeave(displayedFolder).then(() => trashFolder(displayedFolder))
      }
    >
      <span className="u-pomegranate">{t('toolbar.leave')}</span>
    </ActionMenuItem>
  ) : (
    <ActionMenuItem
      data-testid="fil-action-delete"
      left={<Icon icon={TrashIcon} color="var(--errorColor)" />}
      onClick={() => {
        trashFolder(displayedFolder)
      }}
    >
      <span className="u-pomegranate">{t('toolbar.trash')}</span>
    </ActionMenuItem>
  )

DeleteItem.propTypes = {
  t: PropTypes.func.isRequired,
  isSharedWithMe: PropTypes.bool.isRequired,
  displayedFolder: PropTypes.object.isRequired,
  trashFolder: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired
}

export default compose(
  translate(),
  deleteContainer
)(DeleteItem)
