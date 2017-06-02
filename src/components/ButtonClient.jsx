import styles from '../styles/buttonclient'

import { translate } from '../lib/I18n'

import React from 'react'

const ButtonClient = ({ t }) => (
  <a href={t('Nav.link-client')} target='_blank' className={styles['coz-btn-client']}><span>{t('Nav.btn-client')}</span></a>
)

export default translate()(ButtonClient)
