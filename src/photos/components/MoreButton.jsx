import styles from '../styles/toolbar'

import React from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

const MoreButton = ({ t, disabled, onClick }) => (
  <button
    role='button'
    className={classNames('coz-btn', styles['pho-toolbar-more-btn'])}
    disabled={disabled}
    onClick={onClick}
  >
    <span className='coz-hidden'>{t('Toolbar.more')}</span>
  </button>
)

export default translate()(MoreButton)
