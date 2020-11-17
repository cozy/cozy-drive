import React from 'react'
import PropTypes from 'prop-types'

import ProgressionBanner from 'cozy-ui/transpiled/react/ProgressionBanner'
import Icon from 'cozy-ui/transpiled/react/Icon'
import uploadWaitingIcon from '../../../assets/icons/icon-upload-waiting.svg'

const UploadAbortedWifi = ({ t }) => (
  <ProgressionBanner
    icon={<Icon icon={uploadWaitingIcon} />}
    text={t('mobile.settings.media_backup.no_wifi')}
    progressBar={false}
  />
)

UploadAbortedWifi.propTypes = {
  t: PropTypes.func.isRequired
}

export default UploadAbortedWifi
