import cx from 'classnames'
import React from 'react'

import CircleButton from 'cozy-ui/transpiled/react/CircleButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './index.styl'

const MoreButton = ({ disabled, onClick, ...props }) => {
  const { t } = useI18n()
  return (
    <div>
      <CircleButton
        data-testid="more-button"
        className={cx('u-miw-auto', styles['dri-btn--more'])}
        disabled={disabled}
        onClick={onClick}
        size="small"
        aria-label={t('Toolbar.more')}
        {...props}
      >
        <Icon icon={DotsIcon} />
      </CircleButton>
    </div>
  )
}

export default MoreButton
