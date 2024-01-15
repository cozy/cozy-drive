import cx from 'classnames'
import React, { forwardRef } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import { TableCell } from 'cozy-ui/transpiled/react/Table'
import palette from 'cozy-ui/transpiled/react/palette'

import styles from 'styles/filelist.styl'

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
        <Button
          {...(!disabled && { onClick })}
          variant="text"
          label={<Icon icon={DotsIcon} size={17} color={palette.coolGrey} />}
          arial-label={t('Toolbar.more')}
        />
      </span>
    </TableCell>
  )
})

export default FileAction
