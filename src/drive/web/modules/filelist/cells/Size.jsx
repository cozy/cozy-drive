import React from 'react'
import cx from 'classnames'

import { TableCell } from 'cozy-ui/transpiled/react/Table'

import styles from 'drive/styles/filelist.styl'

const _Size = ({ filesize = '—' }) => (
  <TableCell
    className={cx(styles['fil-content-cell'], styles['fil-content-size'])}
  >
    {filesize}
  </TableCell>
)

const Size = React.memo(_Size)

export default Size
