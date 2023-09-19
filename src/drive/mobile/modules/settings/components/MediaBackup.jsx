import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import {
  backupImages,
  startMediaBackup,
  cancelMediaBackup
} from 'drive/mobile/modules/mediaBackup/duck'
import { setWifiOnly, isImagesBackupOn, isWifiOnlyOn } from '../duck'
import SettingCategory, {
  ELEMENT_CHECKBOX,
  ELEMENT_BUTTON
} from './SettingCategory'

export const MediaBackup = ({
  t,
  backupImages,
  setBackupImages,
  wifiOnly,
  setWifiOnly,
  toggleBackup,
  mediaUploading
}) => (
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
        text: (
          <span>
            {!mediaUploading && t('mobile.settings.media_backup.launch')}
            {mediaUploading && t('mobile.settings.media_backup.stop')}
          </span>
        ),
        busy: mediaUploading,
        theme: 'regular',
        onClick: () => toggleBackup(!mediaUploading)
      }
    ]}
  />
)

const mapStateToProps = state => ({
  backupImages: isImagesBackupOn(state),
  wifiOnly: isWifiOnlyOn(state),
  mediaUploading: state.mobile.mediaBackup.uploading
})

const mapDispatchToProps = dispatch => ({
  setBackupImages: value => {
    if (value === false) {
      dispatch(cancelMediaBackup())
      dispatch(backupImages(false, true))
    } else {
      dispatch(backupImages(value))
    }
  },
  setWifiOnly: async value => {
    await dispatch(setWifiOnly(value))
    dispatch(backupImages())
  },
  toggleBackup: launch => {
    if (launch) {
      dispatch(startMediaBackup(true))
    } else {
      dispatch(cancelMediaBackup())
    }
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(MediaBackup))
