import cx from 'classnames'
import React, { forwardRef } from 'react'

import CircleButton from 'cozy-ui/transpiled/react/CircleButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import { TableCell } from 'cozy-ui/transpiled/react/deprecated/Table'

import styles from '@/styles/filelist.styl'

const FileAction = forwardRef(function FileAction(
  { t, onClick, disabled, isInSyncFromSharing },
  ref
) {
  return (
    <TableCell
      className={cx(
        styles['fil-content-cell'],
        styles['fil-content-file-action'],
        { [styles['fil-content-file-action--disabled']]: isInSyncFromSharing }
      )}
    >
      <span ref={ref}>
        <CircleButton
          className="u-miw-auto"
          style={{ boxShadow: 'none' }}
          {...(!disabled && { onClick })}
          size="small"
          aria-label={t('Toolbar.more')}
        >
          <Icon icon={DotsIcon} size={17} />
        </CircleButton>
      </span>
    </TableCell>
  )
})

export default FileAction
