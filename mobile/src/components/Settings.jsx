import styles from '../styles/settings'

import React from 'react'
import { translate } from '../../../src/lib/I18n'

const SubCategory = ({ id, label, value, title }) => (
  <div>
    {title && <h4 className={styles['settings__subcategory-title']}>{title}</h4>}
    <div className={styles['settings__subcategory']}>
      <p className={styles['settings__subcategory__label']}>{label}</p>
      <p id={id} className={styles['settings__subcategory__item']}>{value}</p>
    </div>
  </div>
)

export const Settings = ({ t, version, serverUrl, backupImages, setBackupImages }) => (
  <div>
    <div className={styles['fil-content-row']} />
    <div className={styles['settings']}>
      <h3 className={styles['settings__category-title']}>{t('mobile.settings.media_backup')}</h3>
      <SubCategory id={'backupImages'} label={t('mobile.settings.backup_images_label')} title={t('mobile.settings.backup_images_title')} value={<input type='checkbox' checked={backupImages} onChange={setBackupImages} />} />
      <h3 className={styles['settings__category-title']}>{t('mobile.settings.about')}</h3>
      <SubCategory id={'serverUrl'} label={t('mobile.settings.account')} value={<a href={serverUrl}>{serverUrl}</a>} />
      <SubCategory id={'version'} label={t('mobile.settings.app_version')} value={version} />
    </div>
  </div>
)

export default translate()(Settings)
