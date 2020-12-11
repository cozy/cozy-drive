import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { TableHeader } from 'cozy-ui/transpiled/react/Table'
import Icon from 'cozy-ui/transpiled/react/Icon'

import CertificationTooltip from 'drive/web/modules/certifications/CertificationTooltip'
import iconSafe from 'drive/assets/icons/icon-safe.svg'

import styles from 'drive/styles/filelist.styl'

const ElectronicSafeHeader = () => {
  const { t } = useI18n()

  return (
    <TableHeader className={styles['fil-content-header']}>
      <CertificationTooltip
        body={t('table.head_electronicSafe.title')}
        caption={t('table.head_electronicSafe.caption')}
        content={<Icon icon={iconSafe} size={16} />}
      />
    </TableHeader>
  )
}

export default ElectronicSafeHeader
