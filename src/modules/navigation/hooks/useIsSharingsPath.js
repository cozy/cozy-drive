import { useCallback, useMemo } from 'react'

import { SHARINGS_VIEW_ROUTE } from '@/constants/config'
import { useSharedDrives } from '@/modules/shareddrives/hooks/useSharedDrives'

/**
 * Returns a predicate telling whether a path belongs to the Sharings section,
 * the one highlighted by the Sharings item of the sidebar
 *
 * @returns {(pathname: string) => boolean}
 */
export const useIsSharingsPath = () => {
  const { sharedDrives } = useSharedDrives()

  const orgDriveIds = useMemo(
    () =>
      new Set(
        (sharedDrives || [])
          .filter(drive => drive.org_drive)
          .map(drive => drive._id)
      ),
    [sharedDrives]
  )

  return useCallback(
    pathname => {
      if (
        pathname === SHARINGS_VIEW_ROUTE ||
        pathname.startsWith(`${SHARINGS_VIEW_ROUTE}/`)
      ) {
        return true
      }
      // Organization drives have their own sidebar item
      if (pathname.startsWith('/shareddrive/')) {
        const driveId = pathname.split('/')[2]
        return !orgDriveIds.has(driveId)
      }
      return false
    },
    [orgDriveIds]
  )
}
