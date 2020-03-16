import React, { useState, useCallback } from 'react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import styles from 'drive/styles/toolbar.styl'
import ShortcutCreationModal from './ShortcutCreationModalConnected'

const CreateShortcutWrapper = () => {
  const [isModalDisplayed, setIsModalDisplayed] = useState(false)
  const { t } = useI18n()
  if (!isModalDisplayed) {
    return (
      <a
        data-test-id="create-a-shortcut"
        className={styles['fil-action-create-shortcut']}
        onClick={useCallback(() => {
          setIsModalDisplayed(true)
        })}
      >
        {t('toolbar.menu_create_shortcut')}
      </a>
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
