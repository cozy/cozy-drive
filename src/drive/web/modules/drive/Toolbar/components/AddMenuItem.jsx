import React, { useContext } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import { AddMenuContext } from 'drive/web/modules/drive/AddMenu/AddMenuProvider'

const AddMenuItem = () => {
  const { t } = useI18n()

  const {
    anchorRef,
    handleToggle,
    isDisabled,
    handleOfflineClick,
    isOffline,
    a11y
  } = useContext(AddMenuContext)

  return (
    <div ref={anchorRef} onClick={isOffline ? handleOfflineClick : undefined}>
      <ActionMenuItem
        left={<Icon icon={PlusIcon} />}
        disabled={isDisabled || isOffline}
        icon={PlusIcon}
        onClick={handleToggle}
        {...a11y}
      >
        {t('toolbar.menu_add_item')}
      </ActionMenuItem>
    </div>
  )
}

export default AddMenuItem
