import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import SafeIcon from 'cozy-ui/transpiled/react/Icons/Safe'
import { TableHeader } from 'cozy-ui/transpiled/react/Table'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import CertificationTooltip from 'modules/certifications/CertificationTooltip'

import styles from 'styles/filelist.styl'

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
