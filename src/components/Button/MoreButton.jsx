import React from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import styles from './index.styl'

const MoreButton = ({ t, disabled, onClick }) => (
  <button
    role="button"
    className={classNames(
      styles['c-btn'],
      styles['c-btn--secondary'],
      styles['c-btn--more'],
      styles['dri-btn--more']
    )}
    disabled={disabled}
    onClick={onClick}
  >
    <span className={styles['u-visuallyhidden']}>{t('Toolbar.more')}</span>
  </button>
)

export default translate()(MoreButton)
