import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Button, Icon } from 'cozy-ui/react'

import styles from './index.styl'

const MoreButton = ({ t, disabled, onClick, children }) => (
  <Button
    className={styles['dri-btn--more']}
    theme="secondary"
    disabled={disabled}
    onClick={onClick}
    extension="narrow"
  >
    <Icon icon="dots" width="17" height="17" />
    <span className={styles['u-visuallyhidden']}>{children}</span>
  </Button>
)

export default translate()(MoreButton)
