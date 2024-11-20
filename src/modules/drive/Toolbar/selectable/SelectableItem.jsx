import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckSquareIcon from 'cozy-ui/transpiled/react/Icons/CheckSquare'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

/**
 * Action to show the selection bar
 */
const SelectableItem = ({ onClick }) => {
  const { t } = useI18n()

  return (
    <ActionMenuItem left={<Icon icon={CheckSquareIcon} />} onClick={onClick}>
      left={<Icon icon={CheckSquareIcon} />}
      onClick={showSelectionBar}
    >
      {t('toolbar.menu_select')}
    </ActionMenuItem>
  )
}

SelectableItem.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default SelectableItem
