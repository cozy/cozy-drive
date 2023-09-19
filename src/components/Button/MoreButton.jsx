import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { Button } from 'cozy-ui/transpiled/react'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'

import styles from './index.styl'

const MoreButton = ({ disabled, onClick, ...props }) => {
  const { t } = useI18n()
  return (
    <Button
      data-testid="more-button"
      className={styles['dri-btn--more']}
      theme="secondary"
      disabled={disabled}
      onClick={onClick}
      extension="narrow"
      icon={DotsIcon}
      iconOnly
      label={t('Toolbar.more')}
      {...props}
    />
  )
}

export default MoreButton
