import { useState, useEffect } from 'react'

const withInstance = client => {
  const [instance, setInstance] = useState()
  const [context, setContext] = useState()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const instanceFetched = await client
          .getStackClient()
          .fetchJSON('GET', '/settings/instance')
        setInstance(instanceFetched)
      } catch (e) {} //eslint-disable-line
      try {
        const contextFetched = await client
          .getStackClient()
          .fetchJSON('GET', '/settings/context')
        setContext(contextFetched)
      } catch (e) {} //eslint-disable-line
    }
    fetchData()
  }, [])

  return {
    instance,
    context
  }
}

export default withInstance
