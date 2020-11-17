import React from 'react'
import PropTypes from 'prop-types'

import ProgressionBanner from 'cozy-ui/transpiled/react/ProgressionBanner'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileTypeImageIcon from 'cozy-ui/transpiled/react/Icons/FileTypeImage'

const UploadProgression = ({ t, current, total, progress }) => {
  return (
    <ProgressionBanner
      icon={<Icon icon={FileTypeImageIcon} />}
      text={t('mobile.settings.media_backup.media_upload', {
        smart_count: total - current
      })}
      value={progress}
    />
  )
}

UploadProgression.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  progress: PropTypes.number,
  t: PropTypes.func.isRequired
}

export default UploadProgression
