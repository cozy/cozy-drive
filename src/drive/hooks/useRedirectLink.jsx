import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  useClient,
  generateWebLink,
  deconstructRedirectLink
} from 'cozy-client'

const useRedirectLink = () => {
  const [searchParams] = useSearchParams()
  const params = new URLSearchParams(location.search)
  const client = useClient()

  const isFromPublicFolder = searchParams.get('fromPublicFolder') === 'true'
  const sharecode = params.get('sharecode')

  const [fetchStatus, setFetchStatus] = useState('pending')
  const [instance, setInstance] = useState(client.getStackClient().uri)

  useEffect(() => {
    const fetch = async () => {
      try {
        setFetchStatus('loading')
        const permissions = await client
          .collection('io.cozy.permissions')
          .fetchOwnPermissions()
        if (permissions.included.length > 0) {
          setInstance(permissions.included[0].attributes.instance)
        }
        setFetchStatus('loaded')
      } catch {
        setFetchStatus('error')
      }
    }

    if (!isFromPublicFolder) {
      fetch()
    }
  }, [client, isFromPublicFolder])

  /**
   * We search for redirectLink using two methods because
   * the searchParam differs depending on the position in the url :
   * - for /#hash?searchParam, you need useSearchParams
   * - for /?searchParam#hash, you need location.search
   */
  const redirectLink =
    searchParams.get('redirectLink') || params.get('redirectLink')

  const redirectWebLink = useMemo(() => {
    if (
      redirectLink === null ||
      (fetchStatus !== 'loaded' && !isFromPublicFolder)
    ) {
      return null
    }

    const { slug, pathname, hash } = deconstructRedirectLink(redirectLink)
    const { subdomain: subDomainType } = client.getInstanceOptions()

    const newSearchParams = []
    let newPathname = pathname

    /**
     * If the redirectLink is from a public folder, we want to redirect onto the same instance
     * We need to share the sharecode and pathname (eg. /preview or /public) so that the public folder can be opened
     */
    if (isFromPublicFolder) {
      if (sharecode) {
        newSearchParams.push(['sharecode', sharecode])
      }
      newPathname = location.pathname
    }

    return generateWebLink({
      cozyUrl: instance,
      subDomainType,
      slug,
      pathname: newPathname,
      hash,
      searchParams: newSearchParams
    })
  }, [
    redirectLink,
    fetchStatus,
    isFromPublicFolder,
    client,
    instance,
    sharecode
  ])

  return {
    redirectWebLink,
    redirectLink
  }
}

export { useRedirectLink }
