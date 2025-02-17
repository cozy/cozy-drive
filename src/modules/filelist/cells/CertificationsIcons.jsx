import get from 'lodash/get'
import React, { useCallback } from 'react'

import { useClient } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CarbonCopyIcon from 'cozy-ui/transpiled/react/Icons/CarbonCopy'

import styles from '@/styles/filelist.styl'

const CertificationsIcons = ({ attributes }) => {
  const isCarbonCopy = get(attributes, 'metadata.carbonCopy')
  const isElectronicSafe = get(attributes, 'metadata.electronicSafe')
  const slug = get(attributes, 'cozyMetadata.uploadedBy.slug')
  const client = useClient()

  // TODO To be removed when UI's AppIcon use getIconURL from Cozy-Client
  // instead of its own see https://github.com/cozy/cozy-ui/issues/1723
  const fetchIcon = useCallback(() => {
    return client.getStackClient().getIconURL({
      type: 'konnector',
      slug,
      priority: 'registry'
    })
  }, [client, slug])

  return (
    <div className={styles['fil-file-certifications']}>
      {(isCarbonCopy || isElectronicSafe) && (
        <span className={styles['fil-file-certifications--separator']}>
          {' - '}
        </span>
      )}
      {isCarbonCopy &&
        (isElectronicSafe ? (
          <span data-testid="certificationsIcons-carbonCopyIcon">
            <Icon
              icon={CarbonCopyIcon}
              className={`u-mr-half ${styles['fil-file-certifications--icon']}`}
            />
          </span>
        ) : (
          <span data-testid="certificationsIcons-carbonCopyAppIcon">
            <AppIcon
              app={slug}
              className={styles['fil-file-certifications--icon']}
              fetchIcon={fetchIcon}
              type="konnector"
            />
          </span>
        ))}
      {isElectronicSafe && (
        <span data-testid="certificationsIcons-electronicSafeAppIcon">
          <AppIcon
            app={slug}
            className={styles['fil-file-certifications--icon']}
            fetchIcon={fetchIcon}
            type="konnector"
          />
        </span>
      )}
    </div>
  )
}

export default CertificationsIcons
