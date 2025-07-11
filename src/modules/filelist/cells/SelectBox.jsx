import cx from 'classnames'
import React from 'react'

import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import { TableCell } from 'cozy-ui/transpiled/react/deprecated/Table'

import styles from '@/styles/filelist.styl'

const SelectBox = ({
  withSelectionCheckbox,
  selected,
  onClick,
  disabled,
  viewType
}) => {
  return (
    <TableCell
      className={cx(
        styles['fil-content-cell'],
        styles['fil-content-file-select']
      )}
      {...(!disabled && { onClick })}
    >
      {withSelectionCheckbox && !disabled && (
        <Checkbox
          checked={selected}
          size={viewType === 'grid' ? 'small' : 'medium'}
          onChange={() => {
            // handled by onClick on the <TableCell>
          }}
        />
      )}
    </TableCell>
  )
}

export default SelectBox
