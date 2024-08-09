import React, { useContext } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { AddMenuContext } from 'modules/drive/AddMenu/AddMenuProvider'

export const AddButton = ({ className }) => {
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
        className={className}
        onClick={handleToggle}
        disabled={isDisabled || isOffline}
        startIcon={<Icon icon={PlusIcon} />}
        label={t('toolbar.menu_add')}
        {...a11y}
      />
    </div>
  )
}

export default React.memo(AddButton)
