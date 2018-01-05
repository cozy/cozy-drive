import styles from './oops'

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
      <Button onClick={reload}>{t('error.button.reload')}</Button>
    </p>
  </div>
)

export default translate()(Oops)
