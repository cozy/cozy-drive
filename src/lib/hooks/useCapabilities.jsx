import { useState, useEffect } from 'react'

const useCapabilities = client => {
  const [capabilities, setCapabilities] = useState()
  const [fetchStatus, setFetchStatus] = useState('idle')
  useEffect(() => {
    const fetchData = async () => {
      setFetchStatus('loading')
      try {
        const capabilitiesResult = await client.query(
          client.get('io.cozy.settings', 'capabilities')
        )

        setCapabilities(capabilitiesResult)
        setFetchStatus('loaded')
      } catch (e) {
        setFetchStatus('failed')
      } //eslint-disable-line
    }
    fetchData()
  }, [])

  return {
    capabilities,
    fetchStatus
  }
}

export default useCapabilities
