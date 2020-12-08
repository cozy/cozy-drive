import React from 'react'
import get from 'lodash/get'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { TableCell } from 'cozy-ui/transpiled/react/Table'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Tooltip from 'cozy-ui/transpiled/react/Tooltip'
import Typography from 'cozy-ui/transpiled/react/Typography'

import styles from 'drive/styles/filelist.styl'

const ElectronicSafe = ({ file }) => {
  const { t } = useI18n()

  const hasDataToshow = get(file, 'metadata.electronicSafe')
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
                {t('table.row_electronicSafe.title')}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {t('table.row_electronicSafe.caption', { connectorName })}
              </Typography>
            </div>
          }
        >
          <span>
            <AppIcon app={connectorName} />
          </span>
        </Tooltip>
      ) : (
        '—'
      )}
    </TableCell>
  )
}

export default ElectronicSafe
