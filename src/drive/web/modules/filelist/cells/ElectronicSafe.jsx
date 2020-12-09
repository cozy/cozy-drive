import React from 'react'
import get from 'lodash/get'
import cx from 'classnames'

import { TableCell } from 'cozy-ui/transpiled/react/Table'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'

import styles from 'drive/styles/filelist.styl'

const ElectronicSafe = ({ file }) => {
  const hasDataToshow = get(file, 'metadata.electronicSafe')
  const connectorName = get(file, 'cozyMetadata.uploadedBy.slug')

  return (
    <TableCell
      className={cx(
        styles['fil-content-cell'],
        styles['fil-content-certification']
      )}
    >
      {hasDataToshow ? <AppIcon app={connectorName} /> : '—'}
    </TableCell>
  )
}

export default ElectronicSafe
