import styles from '../styles/breadcrumb'

import React from 'react'
import { translate } from '../plugins/preact-polyglot'

const Location = ({ t }) => (
  <h2 class={styles['fil-content-title']}>{ t('location.title') }</h2>
)

export default translate()(Location)
