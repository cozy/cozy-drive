import cx from 'classnames'
import React from 'react'

import { TableCell } from 'cozy-ui/transpiled/react/deprecated/Table'

import styles from 'styles/filelist.styl'

const _LastUpdate = ({ date, formatted = '—' }) => (
  <TableCell
    className={cx(styles['fil-content-cell'], styles['fil-content-date'])}
  >
    <time dateTime={date}>{formatted}</time>
  </TableCell>
)

const LastUpdate = React.memo(_LastUpdate)

export default LastUpdate
