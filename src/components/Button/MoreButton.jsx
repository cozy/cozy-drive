import React from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react'

import styles from './index.styl'

const MoreButton = ({ t, disabled, onClick, children }) => (
  <Button
    className={classNames(styles['c-btn--more'], styles['dri-btn--more'])}
    theme="secondary"
    disabled={disabled}
    onClick={onClick}
  >
    <span className={styles['u-visuallyhidden']}>{children}</span>
  </Button>
)

export default translate()(MoreButton)
