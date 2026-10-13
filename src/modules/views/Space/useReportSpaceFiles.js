import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useClient } from 'cozy-client'

import logger from '@/lib/logger'
import { isSpacePath } from '@/modules/routeUtils'
import { reportSpaceFiles } from '@/modules/views/Space/SpaceLayout'

// The drive realtime refreshes the shown folder on any change in the drive,
// so each of its loads is when the count of the whole drive may have changed.
const useReportSpaceFiles = (driveId, rootFolderId, lastUpdate) => {
  const client = useClient()
  const { pathname } = useLocation()
  const isInSpace = isSpacePath(pathname)

  useEffect(() => {
    if (!isInSpace || lastUpdate === null) return

    let isCancelled = false
    const report = async () => {
      try {
        const { data } = await client
          .getStackClient()
          .fetchJSON('GET', `/sharings/drives/${driveId}/${rootFolderId}/size`)
        const count = data.attributes.files_count
        if (!isCancelled && count !== undefined) {
          reportSpaceFiles(driveId, count)
        }
      } catch (error) {
        logger.error('Error fetching the files count of a shared drive:', error)
      }
    }
    void report()

    return () => {
      isCancelled = true
    }
  }, [client, isInSpace, driveId, rootFolderId, lastUpdate])
}

export { useReportSpaceFiles }
