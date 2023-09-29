import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { TableHeader } from 'cozy-ui/transpiled/react/Table'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SafeIcon from 'cozy-ui/transpiled/react/Icons/Safe'

import CertificationTooltip from 'drive/web/modules/certifications/CertificationTooltip'

import styles from 'drive/styles/filelist.styl'

const ElectronicSafeHeader = () => {
  const { t } = useI18n()

  return (
    <TableHeader className={styles['fil-content-header']}>
      <CertificationTooltip
        body={t('table.tooltip.electronicSafe.title')}
        caption={t('table.tooltip.electronicSafe.caption')}
        content={<Icon icon={SafeIcon} size={16} />}
      />
    </TableHeader>
  )
}

export default ElectronicSafeHeader
