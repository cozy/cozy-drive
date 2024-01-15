import cx from 'classnames'
import React from 'react'

import { TableCell } from 'cozy-ui/transpiled/react/Table'

import styles from 'styles/filelist.styl'

const Empty = ({ className }) => {
  return (
    <TableCell className={cx(styles['fil-content-cell'], className)}>
      —
    </TableCell>
  )
}

export default Empty
