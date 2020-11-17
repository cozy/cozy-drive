import React from 'react'
import PropTypes from 'prop-types'

import ProgressionBanner from 'cozy-ui/transpiled/react/ProgressionBanner'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Button from 'cozy-ui/transpiled/react/Button'
import PaperplaneIcon from 'cozy-ui/transpiled/react/Icons/Paperplane'
import uploadErrorIcon from '../../../assets/icons/icon-upload-error.svg'

const UploadQuotaError = ({ t, url }) => (
  <ProgressionBanner
    icon={<Icon icon={uploadErrorIcon} />}
    text={t('mobile.settings.media_backup.quota')}
    button={
      <Button
        theme="text"
        icon={PaperplaneIcon}
        label={t('mobile.settings.media_backup.quota_contact')}
        onClick={() => window.open(url, '_system')}
      />
    }
    progressBar={false}
  />
)

UploadQuotaError.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
}

export default UploadQuotaError
