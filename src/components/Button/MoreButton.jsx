import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Button } from 'cozy-ui/transpiled/react'

import styles from './index.styl'

const MoreButton = ({ t, disabled, onClick }) => (
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

export default translate()(MoreButton)
