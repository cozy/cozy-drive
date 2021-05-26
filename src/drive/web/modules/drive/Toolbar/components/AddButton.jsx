import React, { useContext } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import { AddMenuContext } from 'drive/web/modules/drive/AddMenu/AddMenuProvider'

export const AddButton = () => {
  const { t } = useI18n()
  const { anchorRef, handleToggle, isDisabled } = useContext(AddMenuContext)

  return (
    <div ref={anchorRef}>
      <Button
        onClick={handleToggle}
        disabled={isDisabled}
        icon={PlusIcon}
        label={t('toolbar.menu_add')}
      />
    </div>
  )
}

export default React.memo(AddButton)
