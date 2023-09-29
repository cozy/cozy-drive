import React from 'react'
import get from 'lodash/get'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { TableCell } from 'cozy-ui/transpiled/react/Table'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import Icon from 'cozy-ui/transpiled/react/Icon'

import CertificationTooltip from 'drive/web/modules/certifications/CertificationTooltip'

import styles from 'drive/styles/filelist.styl'

const CarbonCopyIcon = ({ file }) => {
  const hasElectronicSafe = get(file, 'metadata.electronicSafe')
  const konnectorName = get(file, 'cozyMetadata.uploadedBy.slug')

  if (hasElectronicSafe) {
    return <Icon icon={CheckIcon} />
  }
  return <AppIcon app={konnectorName} type="konnector" />
}

const CarbonCopy = ({ file }) => {
  const { t } = useI18n()
  const hasDataToshow = get(file, 'metadata.carbonCopy')

  return (
    <TableCell
      className={cx(styles['fil-content-cell'], styles['fil-content-narrow'])}
    >
      {hasDataToshow ? (
        <CertificationTooltip
          body={t('table.tooltip.carbonCopy.title')}
          caption={t('table.tooltip.carbonCopy.caption')}
          content={<CarbonCopyIcon file={file} />}
        />
      ) : (
        '—'
      )}
    </TableCell>
  )
}

export default CarbonCopy
