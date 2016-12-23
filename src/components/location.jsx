import styles from '../styles/location'

import React from 'react'
import { translate } from '../plugins/preact-polyglot'

const Location = ({ t }) => (
  <h2 class={styles['fil-content-title']}>{ t('Files') }</h2>
)

export default translate()(Location)
