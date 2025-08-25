import cx from 'classnames'
import React, { forwardRef } from 'react'

import { Table } from 'cozy-ui/transpiled/react/deprecated/Table'

import styles from '@/styles/filelist.styl'

export const FileList = forwardRef(({ children }, ref) => {
  return (
    <Table
      ref={ref}
      className={cx('u-ov-auto', styles['fil-file-list-container'])}
      role="table"
      tabIndex={0}
    >
      {children}
    </Table>
  )
})

FileList.displayName = 'FileList'
