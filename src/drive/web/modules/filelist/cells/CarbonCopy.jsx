import React from 'react'
import get from 'lodash/get'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { TableCell } from 'cozy-ui/transpiled/react/Table'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Tooltip from 'cozy-ui/transpiled/react/Tooltip'
import Typography from 'cozy-ui/transpiled/react/Typography'

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
  const { t } = useI18n()
  const hasDataToshow = get(file, 'metadata.carbonCopy')
  const connectorName = get(file, 'cozyMetadata.uploadedBy.slug')

  return (
    <TableCell
      className={cx(
        styles['fil-content-cell'],
        styles['fil-content-certification']
      )}
    >
      {hasDataToshow ? (
        <Tooltip
          title={
            <div className="u-p-half">
              <Typography variant="body1">
                {t('table.row_carbonCopy.title')}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {t('table.row_carbonCopy.caption', { connectorName })}
              </Typography>
            </div>
          }
        >
          <span>
            <CarbonCopyIcon file={file} />
          </span>
        </Tooltip>
      ) : (
        '—'
      )}
    </TableCell>
  )
}

export default CarbonCopy
