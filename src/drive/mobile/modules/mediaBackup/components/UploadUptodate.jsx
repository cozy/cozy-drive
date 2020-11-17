import React from 'react'
import PropTypes from 'prop-types'

import ProgressionBanner from 'cozy-ui/transpiled/react/ProgressionBanner'
import Icon from 'cozy-ui/transpiled/react/Icon'
import uploadOkIcon from '../../../assets/icons/icon-upload-OK.svg'

const UploadUptodate = ({ t }) => (
  <ProgressionBanner
    icon={<Icon icon={uploadOkIcon} />}
    text={t('mobile.settings.media_backup.media_uptodate')}
    progressBar={false}
  />
)

UploadUptodate.propTypes = {
  t: PropTypes.func.isRequired
}

export default UploadUptodate
