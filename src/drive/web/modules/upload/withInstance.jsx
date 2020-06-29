import { useState, useEffect } from 'react'

const useInstance = client => {
  const [instance, setInstance] = useState(null)
  const [context, setContext] = useState(null)
  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const instancePromise = client
            .getStackClient()
            .fetchJSON('GET', '/settings/instance')

          const contextPromise = client
            .getStackClient()
            .fetchJSON('GET', '/settings/context')
          const promises = [instancePromise, contextPromise]

          const [instanceFetched, contextFetched] = await Promise.all(
            promises.map(p => p.catch(e => e))
          )
          if (!(instanceFetched instanceof Error)) {
            setInstance(instanceFetched)
          }
          if (!(contextFetched instanceof Error)) {
            setContext(contextFetched)
          }
      } catch (e) {} //eslint-disable-line
      }
      fetchData()
    },
    [client]
  )

  return {
    instance,
    context
  }
}

export default useInstance
