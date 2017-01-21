import styles from '../styles/loading'

import React from 'react'
import { translate } from '../lib/I18n'

const Loading = ({ t, loadingType }) => {
  return (
    <div class={styles['pho-loading']}>
      <p>{t(`Loading.${loadingType}`)}</p>
    </div>
  )
}

export default translate()(Loading)
