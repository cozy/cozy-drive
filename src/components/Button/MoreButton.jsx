import cx from 'classnames'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './index.styl'

const MoreButton = ({ disabled, onClick, ...props }) => {
  const { t } = useI18n()
  return (
    <Button
      data-testid="more-button"
      className={cx('u-miw-auto', styles['dri-btn--more'])}
      variant="secondary"
      disabled={disabled}
      onClick={onClick}
      label={<Icon icon={DotsIcon} />}
      aria-label={t('Toolbar.more')}
      {...props}
    />
  )
}

export default MoreButton
