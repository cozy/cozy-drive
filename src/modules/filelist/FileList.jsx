import React from 'react'

import { Table } from 'cozy-ui/transpiled/react/deprecated/Table'

export const FileList = ({ children }) => (
  <Table className="u-ov-auto" role="table">
    {children}
  </Table>
)
