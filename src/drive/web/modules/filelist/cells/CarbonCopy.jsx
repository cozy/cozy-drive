import React from 'react'
import get from 'lodash/get'
import cx from 'classnames'

import { TableCell } from 'cozy-ui/transpiled/react/Table'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import Icon from 'cozy-ui/transpiled/react/Icon'

import styles from 'drive/styles/filelist.styl'

const CarbonCopyIcon = ({ file }) => {
  const hasElectronicSafe = get(file, 'metadata.electronicSafe')
  const connectorName = get(file, 'cozyMetadata.uploadedBy.slug')

  if (hasElectronicSafe) {
    return <Icon icon={CheckIcon} />
  }
  return <AppIcon app={connectorName} />
}

const CarbonCopy = ({ file }) => {
  const hasDataToshow = get(file, 'metadata.carbonCopy')

  return (
    <TableCell
      className={cx(
        styles['fil-content-cell'],
        styles['fil-content-certification']
      )}
    >
      {hasDataToshow ? <CarbonCopyIcon file={file} /> : '—'}
    </TableCell>
  )
}

export default CarbonCopy
