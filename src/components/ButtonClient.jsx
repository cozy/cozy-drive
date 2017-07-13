import styles from '../styles/buttonclient'

import { translate } from 'cozy-ui/react/I18n'

import React from 'react'

const ButtonClient = ({ url, className, text }) => (
  <a href={url} target='_blank' className={className}><span>{text}</span></a>
)

const DumbButtonClientDesktop = ({ t }) => (
  <ButtonClient icon={t('nav.link-client')} className={styles['coz-btn-client']} text={t('nav.btn-client')} />
)

const DumbButtonClientWeb = ({ t }) => (
  <ButtonClient icon={t('nav.link-client-web')} className={styles['coz-btn-client']} text={t('nav.btn-client-web')} />
)

export const ButtonClientDesktop = translate()(DumbButtonClientDesktop)
export const ButtonClientWeb = translate()(DumbButtonClientWeb)
