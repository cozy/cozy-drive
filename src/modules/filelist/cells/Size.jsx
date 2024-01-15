import cx from 'classnames'
import React from 'react'

import { TableCell } from 'cozy-ui/transpiled/react/Table'

import styles from 'styles/filelist.styl'

const _Size = ({ filesize = '—' }) => (
  <TableCell
    className={cx(styles['fil-content-cell'], styles['fil-content-size'])}
  >
    {filesize}
  </TableCell>
)

const Size = React.memo(_Size)

export default Size
