import cx from 'classnames'
import React from 'react'

import { TableCell } from 'cozy-ui/transpiled/react/deprecated/Table'

import styles from '@/styles/filelist.styl'

import { ShareContent } from '@/modules/filelist/cells/ShareContent'

const Status = ({ file, disabled, isInSyncFromSharing }) => {
  return (
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-content-status'])}
    >
      <ShareContent
        file={file}
        disabled={disabled}
        isInSyncFromSharing={isInSyncFromSharing}
      />
    </TableCell>
  )
}

export default Status
