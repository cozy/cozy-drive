import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../../src/lib/I18n'

import styles from '../styles/settings'

const SubCategory = ({id, label, value}) => (
  <div className={styles['settings__subcategory']}>
    <h4 className={styles['settings__subcategory-title']}>{label}</h4>
    <p id={id} className={styles['settings__subcategory-item']}>{value}</p>
  </div>
)

export const Settings = ({t, version, serverUrl}) => (
  <div>
    <div className={styles['fil-content-row']} />
    <div className={styles['settings']}>
      <h3 className={styles['settings__category-title']}>{t('mobile.settings.about')}</h3>
      <SubCategory id={'serverUrl'} label={t('mobile.settings.account')} value={<a href={serverUrl}>{serverUrl}</a>} />
      <SubCategory id={'version'} label={t('mobile.settings.app_version')} value={version} />
    </div>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  version: window.navigator.appInfo ? window.navigator.appInfo.version : 'dev',
  serverUrl: state.mobile.serverUrl
})

export default translate()(connect(mapStateToProps)(Settings))
