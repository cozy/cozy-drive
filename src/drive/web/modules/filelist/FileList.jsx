import React from 'react'

import { Table } from 'cozy-ui/transpiled/react/Table'

import styles from 'drive/styles/filelist.styl'

export const FileList = ({ children }) => (
  <Table className={styles['fil-content-table']} role="table">
    {children}
  </Table>
)
