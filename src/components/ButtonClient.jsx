import styles from '../styles/buttonclient'

import { translate } from 'cozy-ui/react/I18n'

import React from 'react'

const ButtonClient = ({ url, className, text }) => (
  <a href={url} target='_blank' className={className}><span>{text}</span></a>
)

const DumbButtonClientDesktop = ({ t }) => (
  <ButtonClient icon={t('nav.link-client')} className={styles['coz-btn-client']} text={t('nav.btn-client')} />
)

export const ButtonClientDesktop = translate()(DumbButtonClientDesktop)
