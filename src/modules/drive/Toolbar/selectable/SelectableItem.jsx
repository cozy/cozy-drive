import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckSquareIcon from 'cozy-ui/transpiled/react/Icons/CheckSquare'

/**
 * Action to show the selection bar
 */
const SelectableItem = ({ showSelectionBar }) => {
  const { t } = useI18n()

  return (
    <ActionMenuItem
      left={<Icon icon={CheckSquareIcon} />}
      onClick={showSelectionBar}
    >
      {t('toolbar.menu_select')}
    </ActionMenuItem>
  )
}

SelectableItem.propTypes = {
  /** Function to show the selection bar coming from SelectionBar */
  showSelectionBar: PropTypes.func.isRequired
}

export default SelectableItem
