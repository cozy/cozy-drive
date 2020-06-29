import { useState, useEffect } from 'react'

const useDiskUsage = client => {
  const [diskusage, setDiskusage] = useState()

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const diskusageResult = await client
            .getStackClient()
            .fetchJSON('GET', '/settings/disk-usage')
          setDiskusage(diskusageResult)
      } catch (e) {} //eslint-disable-line
      }
      fetchData()
    },
    [client]
  )

  return diskusage
}

export default useDiskUsage
