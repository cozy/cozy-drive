import React from 'react'
import cx from 'classnames'

import { TableCell } from 'cozy-ui/transpiled/react/Table'
import Icon from 'cozy-ui/transpiled/react/Icon'
import palette from 'cozy-ui/transpiled/react/palette'
import PhoneDownloadIcon from 'cozy-ui/transpiled/react/Icons/PhoneDownload'

import { ShareContent } from 'drive/web/modules/filelist/cells/ShareContent'

import styles from 'styles/filelist.styl'

const Status = ({
  isAvailableOffline,
  file,
  disabled,
  isInSyncFromSharing
}) => {
  return (
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-content-status'])}
    >
      {isAvailableOffline && !disabled && (
        <span className={styles['fil-content-offline']}>
          <Icon
            icon={PhoneDownloadIcon}
            color={palette.white}
            width="14"
            height="14"
          />
        </span>
      )}
      <ShareContent
        file={file}
        disabled={disabled}
        isInSyncFromSharing={isInSyncFromSharing}
      />
    </TableCell>
  )
}

export default Status
