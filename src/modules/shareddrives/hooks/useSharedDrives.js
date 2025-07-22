import { useState, useEffect } from 'react'

import { useClient } from 'cozy-client'

export const useSharedDrives = () => {
  const client = useClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [sharedDrives, setSharedDrives] = useState([])

  useEffect(() => {
    const fetchSharedDrives = async () => {
      setIsLoading(true)

      const { data: sharedDrives } = await client
        .collection('io.cozy.sharings')
        .fetchSharedDrives()

      setSharedDrives(sharedDrives)
      setIsLoading(false)
      setIsLoaded(true)
    }

    if (!isLoading && !isLoaded) {
      void fetchSharedDrives()
    }
  })

  return { isLoading, isLoaded, sharedDrives }
}
