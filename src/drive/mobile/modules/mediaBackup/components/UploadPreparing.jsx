import React from 'react'
import PropTypes from 'prop-types'

import ProgressionBanner from 'cozy-ui/transpiled/react/ProgressionBanner'
import Icon from 'cozy-ui/transpiled/react/Icon'
import uploadWaitingIcon from '../../../assets/icons/icon-upload-waiting.svg'

const UploadPreparing = ({ t }) => (
  <ProgressionBanner
    icon={<Icon icon={uploadWaitingIcon} />}
    text={t('mobile.settings.media_backup.preparing')}
  />
)

UploadPreparing.propTypes = {
  t: PropTypes.func.isRequired
}

export default UploadPreparing
