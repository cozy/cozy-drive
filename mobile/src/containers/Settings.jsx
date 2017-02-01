import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../../src/lib/I18n'

import styles from '../styles/settings'

const Settings = ({t, version, serverUrl}) => (
  <div className={styles['settings']}>
    <h3 className={styles['settings__category']}>{t('mobile.settings.about')}</h3>
    <h4 className={styles['settings__subcategory']}>{t('mobile.settings.app_version')}</h4>
    <p className={styles['settings__item']}>{version}</p>
    <h4 className={styles['settings__subcategory']}>{t('mobile.settings.account')}</h4>
    <p className={styles['settings__item']}>{serverUrl}</p>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  version: window.navigator.appInfo ? window.navigator.appInfo.version : 'dev (run in cordova to get the config.xml version)',
  serverUrl: state.mobile.serverUrl
})

export default translate()(connect(mapStateToProps)(Settings))
