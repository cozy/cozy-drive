import React from 'react'
import cx from 'classnames'

import { TableCell } from 'cozy-ui/transpiled/react/Table'

import styles from 'drive/styles/filelist.styl'

const SelectBox = ({ withSelectionCheckbox, selected, onClick, disabled }) => (
  <TableCell
    className={cx(
      styles['fil-content-cell'],
      styles['fil-content-file-select']
    )}
    {...(!disabled && { onClick })}
  >
    {withSelectionCheckbox && !disabled && (
      <span data-input="checkbox">
        <input
          onChange={() => {
            // handled by onClick on the <TableCell>
          }}
          type="checkbox"
          checked={selected}
        />
        <label />
      </span>
    )}
  </TableCell>
)

export default SelectBox
