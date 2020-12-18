import React from 'react'
import cx from 'classnames'

import { TableCell } from 'cozy-ui/transpiled/react/Table'

import styles from 'drive/styles/filelist.styl'

const Empty = ({ className }) => {
  return (
    <TableCell className={cx(styles['fil-content-cell'], className)}>
      —
    </TableCell>
  )
}

export default Empty
