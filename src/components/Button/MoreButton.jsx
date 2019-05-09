import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react'

import styles from './index.styl'

const MoreButton = ({ t, disabled, onClick }) => (
  <Button
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

export default translate()(MoreButton)
