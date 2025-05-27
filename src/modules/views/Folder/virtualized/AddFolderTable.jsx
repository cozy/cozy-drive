import React from 'react'

import { useVaultClient } from 'cozy-keys-lib'
import Table from 'cozy-ui/transpiled/react/Table'
import TableBody from 'cozy-ui/transpiled/react/TableBody'
import TableCell from 'cozy-ui/transpiled/react/TableCell'
import TableHead from 'cozy-ui/transpiled/react/TableHead'
import TableRow from 'cozy-ui/transpiled/react/TableRow'

import AddFolder from '@/modules/filelist/AddFolder'

const AddFolderTable = ({ columns, currentFolderId }) => {
  const vaultClient = useVaultClient()

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column, idx) => (
            <TableCell
              key={idx}
              className={column.id === 'name' ? 'u-pl-1' : ''}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell className="u-pl-1">
            <AddFolder
              vaultClient={vaultClient}
              currentFolderId={currentFolderId}
            />
          </TableCell>
          <TableCell>—</TableCell>
          <TableCell>—</TableCell>
          <TableCell>—</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default AddFolderTable
