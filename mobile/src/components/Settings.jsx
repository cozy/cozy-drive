import React from 'react'
import Modal from 'cozy-ui/react/Modal'
import styles from '../styles/settings'
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

export const Settings = ({ t, version, serverUrl, backupImages, setBackupImages, client, showUnlinkConfirmation, displayUnlinkConfirmation, hideUnlinkConfirmation, unlink, mediaUploading, launchBackup }) => (
  <div>
    <div className={styles['fil-content-row']} />
    <div className={styles['settings']}>

      <h3 className={styles['settings__category-title']}>{t('mobile.settings.media_backup.title')}</h3>
      <SubCategory id={'backupImages'} title={t('mobile.settings.media_backup.images.title')}
        label={t('mobile.settings.media_backup.images.label')}
        value={<input type='checkbox' checked={backupImages} onChange={setBackupImages} />} />
      <button onclick={launchBackup}>
        {t('mobile.settings.media_backup.launch')}
        {mediaUploading && <div className={styles['media-uploading']} />}
      </button>

      <h3 className={styles['settings__category-title']}>{t('mobile.settings.about.title')}</h3>
      <SubCategory id={'serverUrl'} label={t('mobile.settings.about.account')}
        value={<a href={serverUrl}>{serverUrl}</a>} />
      <SubCategory id={'version'} label={t('mobile.settings.about.app_version')} value={version} />

      <h3 className={styles['settings__category-title']}>{t('mobile.settings.unlink.title')}</h3>
      <p>{t('mobile.settings.unlink.description')}</p>
      <button className={styles['settings__button-danger']} onClick={showUnlinkConfirmation}>{t('mobile.settings.unlink.button')}</button>
      {displayUnlinkConfirmation && <Modal
        title={t('mobile.settings.unlink.confirmation.title')}
        description={t('mobile.settings.unlink.confirmation.description')}
        cancelText={t('mobile.settings.unlink.confirmation.cancel')}
        cancelAction={hideUnlinkConfirmation}
        validateType='danger'
        validateText={t('mobile.settings.unlink.confirmation.unlink')}
        validateAction={() => unlink(client)}
      />}

    </div>
  </div>
)

export default translate()(Settings)
