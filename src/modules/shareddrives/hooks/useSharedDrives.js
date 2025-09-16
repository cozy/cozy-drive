import { useState, useEffect } from 'react'

import { useClient, useQuery } from 'cozy-client'

import { DEFAULT_SORT } from '@/config/sort'
import { SHARED_DRIVES_DIR_ID } from '@/constants/config'
import { buildDriveQuery } from '@/queries'

export const useSharedDrives = () => {
  const client = useClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [sharedDrives, setSharedDrives] = useState([])

  const folderQuery = buildDriveQuery({
    currentFolderId: SHARED_DRIVES_DIR_ID,
    type: 'directory',
    sortAttribute: DEFAULT_SORT.attribute,
    sortOrder: DEFAULT_SORT.order
  })
  const { lastUpdate } = useQuery(folderQuery.definition, folderQuery.options)

  useEffect(() => {
    let isCancelled = false

    const fetchSharedDrives = async () => {
      setIsLoading(true)
      try {
        const { data: sharedDrives } = await client
          .collection('io.cozy.sharings')
          .fetchSharedDrives()

        if (!isCancelled) {
          setSharedDrives(sharedDrives)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
          setIsLoaded(true)
        }
      }
    }

    void fetchSharedDrives()

    return () => {
      isCancelled = true
    }
  }, [client, lastUpdate])

  return { isLoading, isLoaded, sharedDrives }
}
