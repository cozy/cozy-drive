import React, { useContext } from 'react'

import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { AddMenuContext } from 'modules/drive/AddMenu/AddMenuProvider'

export const AddButton = () => {
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
      <Button
        onClick={handleToggle}
        disabled={isDisabled || isOffline}
        icon={PlusIcon}
        label={t('toolbar.menu_add')}
        {...a11y}
      />
    </div>
  )
}

export default React.memo(AddButton)
