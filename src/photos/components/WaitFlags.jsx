import { useEffect, useState } from 'react'
import { useClient } from 'cozy-client'

const WaitFlags = ({ children }) => {
  const client = useClient()
  const [isFlagsPluginLoading, setIsFlagsPluginLoading] = useState(true)

  useEffect(() => {
    const waitFlagsPlugin = async () => {
      await client.plugins.flags.initializing
      setIsFlagsPluginLoading(false)
    }

    waitFlagsPlugin()
  }, [client])

  if (isFlagsPluginLoading) {
    return null
  }

  return children
}

export default WaitFlags
