import React, { forwardRef } from 'react'
import cx from 'classnames'

import { TableCell } from 'cozy-ui/transpiled/react/Table'
import Button from 'cozy-ui/transpiled/react/Button'
import Icon from 'cozy-ui/transpiled/react/Icon'
import palette from 'cozy-ui/transpiled/react/palette'

import styles from 'drive/styles/filelist.styl'

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
          theme="action"
          {...!disabled && { onClick }}
          extension="narrow"
          icon={
            <Icon
              icon="dots"
              color={palette.charcoalGrey}
              width="17"
              height="17"
            />
          }
          iconOnly
          label={t('Toolbar.more')}
        />
      </span>
    </TableCell>
  )
})

export default FileAction
