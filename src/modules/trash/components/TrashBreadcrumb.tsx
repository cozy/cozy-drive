import React, { useMemo, FC, useCallback } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ROOT_DIR_ID, TRASH_DIR_ID } from 'constants/config.js'
import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/breadcrumb/components/MobileAwareBreadcrumb'
import { useBreadcrumbPath } from 'modules/breadcrumb/hooks/useBreadcrumbPath.jsx'

interface TrashBreadcrumbProps {
  currentFolderId: string
  navigateToFolder: (args: { id: string }) => void
}

const TrashBreadcrumb: FC<TrashBreadcrumbProps> = ({
  currentFolderId,
  navigateToFolder
}) => {
  const { t } = useI18n()

  const rootBreadcrumbPath = useMemo(
    () => ({
      id: TRASH_DIR_ID,
      name: t('breadcrumb.title_trash')
    }),
    [t]
  )

  const path = useBreadcrumbPath({
    currentFolderId,
    rootBreadcrumbPath
  })

  const trashPath = [
    {
      id: ROOT_DIR_ID,
      name: t('breadcrumb.title_drive')
    },
    ...path
  ]

  const handleBreadcrumbClick = useCallback(
    ({ id }: { id: string }) => navigateToFolder({ id }),
    [navigateToFolder]
  )

  return (
    <Breadcrumb
      path={trashPath}
      onBreadcrumbClick={handleBreadcrumbClick}
      opening={false}
    />
  )
}

export { TrashBreadcrumb }
