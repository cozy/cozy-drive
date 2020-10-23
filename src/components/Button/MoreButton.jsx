import React from 'react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Button } from 'cozy-ui/transpiled/react'

import styles from './index.styl'

const MoreButton = ({ disabled, onClick }) => {
  const { t } = useI18n()
  return (
    <Button
      data-test-id="more-button"
      className={styles['dri-btn--more']}
      theme="secondary"
      disabled={disabled}
      onClick={onClick}
      extension="narrow"
      icon="dots"
      iconOnly
      label={t('Toolbar.more')}
    />
  )
}

export default MoreButton
