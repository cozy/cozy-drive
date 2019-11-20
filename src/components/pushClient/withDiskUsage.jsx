import { useState, useEffect } from 'react'

const withDiskUsage = client => {
  const [diskusage, setDiskusage] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const diskusageResult = await client
          .getStackClient()
          .fetchJSON('GET', '/settings/disk-usage')
        setDiskusage(diskusageResult)
      } catch (e) {} //eslint-disable-line
    }
    fetchData()
  }, [])

  return diskusage
}

export default withDiskUsage
