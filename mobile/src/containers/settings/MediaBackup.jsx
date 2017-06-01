import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../../../src/lib/I18n'
import SettingCategory, { ELEMENT_CHECKBOX, ELEMENT_BUTTON } from '../../components/SettingCategory'
import { setWifiOnly } from '../../actions/settings'
import { backupImages, startMediaBackup, cancelMediaBackup } from '../../actions/mediaBackup'

export const MediaBackup = ({ t, backupImages, setBackupImages, wifiOnly, setWifiOnly, toggleBackup, mediaUploading }) => (
  <SettingCategory
    title={t('mobile.settings.media_backup.title')}
    elements={[
      {
        type: ELEMENT_CHECKBOX,
        title: t('mobile.settings.media_backup.images.title'),
        label: t('mobile.settings.media_backup.images.label'),
        id: 'backup_images_checkbox',
        checked: backupImages,
        onChange: setBackupImages
      },
      {
        type: ELEMENT_CHECKBOX,
        title: t('mobile.settings.media_backup.wifi.title'),
        label: t('mobile.settings.media_backup.wifi.label'),
        id: 'backup_only_wifi_checkbox',
        checked: wifiOnly,
        onChange: setWifiOnly
      },
      {
        type: ELEMENT_BUTTON,
        text: <span>
          {!mediaUploading && t('mobile.settings.media_backup.launch')}
          {mediaUploading && t('mobile.settings.media_backup.stop')}
        </span>,
        busy: mediaUploading,
        theme: 'regular',
        onClick: () => toggleBackup(!mediaUploading, t('mobile.settings.media_backup.media_folder'))
      }
    ]}
  />
)

const mapStateToProps = state => ({
  backupImages: state.mobile.settings.backupImages,
  wifiOnly: state.mobile.settings.wifiOnly,
  mediaUploading: state.mobile.mediaBackup.uploading
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setBackupImages: (value) => {
    const path = ownProps.t('mobile.settings.media_backup.media_folder')
    dispatch(backupImages(path, value))
  },
  setWifiOnly: async (value) => {
    await dispatch(setWifiOnly(value))
    const path = ownProps.t('mobile.settings.media_backup.media_folder')
    dispatch(backupImages(path))
  },
  toggleBackup: (launch, path) => {
    if (launch) {
      dispatch(startMediaBackup(path, true))
    } else {
      dispatch(cancelMediaBackup())
    }
  }
})

export default translate()(connect(mapStateToProps, mapDispatchToProps)(MediaBackup))
