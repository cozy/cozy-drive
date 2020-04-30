import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import selectableContainer from './selectable'

const SelectableItem = ({ t, showSelectionBar }) => (
  <ActionMenuItem
    left={<Icon icon="check-square" />}
    onClick={showSelectionBar}
  >
    {t('toolbar.menu_select')}
  </ActionMenuItem>
)

export default selectableContainer(translate()(SelectableItem))
