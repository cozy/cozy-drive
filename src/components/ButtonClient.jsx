import styles from '../styles/buttonclient'

import { translate } from 'cozy-ui/react/I18n'

import React from 'react'

const ButtonClient = ({ t }) => (
  <a href={t('nav.link-client')} target='_blank' className={styles['coz-btn-client']}><span>{t('nav.btn-client')}</span></a>
)

export default translate()(ButtonClient)
