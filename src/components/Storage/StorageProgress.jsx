import React from 'react'

import { useInstanceInfo } from 'cozy-client'
import { makeDiskInfos } from 'cozy-client/dist/models/instance'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CloudIcon from 'cozy-ui/transpiled/react/Icons/Cloud'
import { LinearProgress } from 'cozy-ui/transpiled/react/Progress'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

/**
 * Show remaining disk space with a progress bar
 */
const StorageProgress = () => {
  const { t } = useI18n()

  const { diskUsage } = useInstanceInfo()

  const { humanDiskQuota, humanDiskUsage, percentUsage } = makeDiskInfos(
    diskUsage.data?.used,
    diskUsage.data?.quota
  )

  return (
    <>
      <div className="u-flex u-flex-items-center">
        <Icon
          className="u-mr-half"
          icon={CloudIcon}
          size={24}
          color="var(--iconTextColor)"
        />
        <Typography variant="caption">{t('Storage.title')}</Typography>
      </div>
      <LinearProgress
        className="u-mv-half"
        variant="determinate"
        value={parseInt(percentUsage)}
      />
      <Typography variant="caption">
        {t('Storage.availability', {
          smart_count: (humanDiskQuota - humanDiskUsage).toFixed(2)
        })}
      </Typography>
    </>
  )
}

export default StorageProgress
