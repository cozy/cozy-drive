import React, { useState, useCallback } from 'react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ShortcutCreationModal from './ShortcutCreationModalConnected'

const CreateShortcutWrapper = () => {
  const [isModalDisplayed, setIsModalDisplayed] = useState(false)
  const { t } = useI18n()
  if (!isModalDisplayed) {
    return (
      <ActionMenuItem
        data-test-id="create-a-shortcut"
        left={<Icon icon="link" />}
        onClick={useCallback(() => {
          setIsModalDisplayed(true)
        })}
      >
        {t('toolbar.menu_create_shortcut')}
      </ActionMenuItem>
    )
  } else {
    return (
      <ShortcutCreationModal
        onClose={useCallback(() => setIsModalDisplayed(false))}
      />
    )
  }
}

export default CreateShortcutWrapper
