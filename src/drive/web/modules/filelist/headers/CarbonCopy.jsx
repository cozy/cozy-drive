import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { TableHeader } from 'cozy-ui/transpiled/react/Table'
import Icon from 'cozy-ui/transpiled/react/Icon'

import CertificationTooltip from 'drive/web/modules/certifications/CertificationTooltip'
import iconCertified from 'drive/assets/icons/icon-certified.svg'

import styles from 'drive/styles/filelist.styl'

const CarbonCopyHeader = () => {
  const { t } = useI18n()

  return (
    <TableHeader className={styles['fil-content-header']}>
      <CertificationTooltip
        body={t('table.head_carbonCopy.title')}
        caption={t('table.head_carbonCopy.caption')}
        content={<Icon icon={iconCertified} size={16} />}
      />
    </TableHeader>
  )
}

export default CarbonCopyHeader
