import React from 'react'
import get from 'lodash/get'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { TableCell } from 'cozy-ui/transpiled/react/Table'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'

import CertificationTooltip from 'drive/web/modules/certifications/CertificationTooltip'

import styles from 'drive/styles/filelist.styl'

const ElectronicSafe = ({ file }) => {
  const { t } = useI18n()

  const hasDataToshow = get(file, 'metadata.electronicSafe')
  const konnectorName = get(file, 'cozyMetadata.uploadedBy.slug')

  return (
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-content-narrow'])}
    >
      {hasDataToshow ? (
        <CertificationTooltip
          body={t('table.tooltip.electronicSafe.title')}
          caption={t('table.tooltip.electronicSafe.caption')}
          content={<AppIcon app={konnectorName} type="konnector" />}
        />
      ) : (
        '—'
      )}
    </TableCell>
  )
}

export default ElectronicSafe
