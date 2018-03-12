import styles from './oops.styl'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react'

const reload = () => {
  window.location.reload()
}

const Oops = ({ t }) => (
  <div className={styles['fil-oops']}>
    <h2>{t('error.open_folder')}</h2>
    <p>
      <Button onClick={reload} label={t('error.button.reload')} />
    </p>
  </div>
)

export default translate()(Oops)
