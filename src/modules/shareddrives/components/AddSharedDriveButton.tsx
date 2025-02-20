import React, { FC } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

interface AddSharedDriveButtonProps {
  onClick: () => void
}

const AddSharedDriveButton: FC<AddSharedDriveButtonProps> = ({ onClick }) => {
  const { t } = useI18n()

  return (
    <Button
      onClick={onClick}
      startIcon={<Icon icon={PlusIcon} />}
      label={t('toolbar.menu_add')}
    />
  )
}

export default AddSharedDriveButton
