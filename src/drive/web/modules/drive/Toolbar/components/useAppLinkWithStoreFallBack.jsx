import { useEffect, useState } from 'react'
import { Q, models } from 'cozy-client'

const { applications } = models

const useAppLinkWithStoreFallback = (slug, client, path = '') => {
  const [fetchStatus, setFetchStatus] = useState('loading')
  const [isInstalled, setIsInstalled] = useState(true)
  const [url, setURL] = useState()

  useEffect(
    () => {
      const load = async () => {
        try {
          const apps = await client.query(Q('io.cozy.apps'))
          const appDocument = { slug }
          const appInstalled = applications.isInstalled(apps.data, appDocument)
          setIsInstalled(!!appInstalled)
          if (appInstalled) {
            setURL(applications.getUrl(appInstalled) + path)
          } else {
            setURL(applications.getStoreURL(apps.data, appDocument))
          }
          setFetchStatus('loaded')
        } catch (error) {
          setFetchStatus('errored')
        }
      }
      load()
    },
    [client, slug, path]
  )

  return {
    fetchStatus,
    isInstalled,
    url
  }
}

export default useAppLinkWithStoreFallback
