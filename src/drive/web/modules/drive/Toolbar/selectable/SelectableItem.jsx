import React from 'react'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckSquareIcon from 'cozy-ui/transpiled/react/Icons/CheckSquare'

import selectableContainer from './selectable'

const SelectableItem = ({ t, showSelectionBar }) => (
  <ActionMenuItem
    left={<Icon icon={CheckSquareIcon} />}
    onClick={showSelectionBar}
  >
    {t('toolbar.menu_select')}
  </ActionMenuItem>
)

export default selectableContainer(translate()(SelectableItem))
