import React, { useContext } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import { AddMenuContext } from 'drive/web/modules/drive/AddMenu/AddMenuProvider'

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
