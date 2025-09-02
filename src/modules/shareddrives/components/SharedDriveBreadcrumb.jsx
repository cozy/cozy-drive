import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { SHARED_DRIVES_DIR_ID } from '@/constants/config.js'
import { MobileAwareBreadcrumb as Breadcrumb } from '@/modules/breadcrumb/components/MobileAwareBreadcrumb'
import { buildSharedDriveIdQuery } from '@/queries'

const SharedDriveBreadcrumb = ({ driveId }) => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const sharedDriveQuery = buildSharedDriveIdQuery({ driveId })
  const { data: sharedDrive } = useQuery(
    sharedDriveQuery.definition,
    sharedDriveQuery.options
  )

  const handleBreadcrumbClick = useCallback(
    ({ id }) => {
      if (id === SHARED_DRIVES_DIR_ID) {
        navigate(`/folder/${SHARED_DRIVES_DIR_ID}`)
      }
    },
    [navigate]
  )

  return (
    <Breadcrumb
      path={[
        {
          id: SHARED_DRIVES_DIR_ID,
          name: t('breadcrumb.title_shared_drives')
        },
        { id: driveId, name: sharedDrive?.rules[0]?.title }
      ]}
      onBreadcrumbClick={handleBreadcrumbClick}
      opening={false}
    />
  )
}

export { SharedDriveBreadcrumb }
