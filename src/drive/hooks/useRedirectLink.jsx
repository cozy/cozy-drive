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
    fetch()
  }, [client])

  /**
   * We search for redirectLink using two methods because
   * the searchParam differs depending on the position in the url :
   * - for /#hash?searchParam, you need useSearchParams
   * - for /?searchParam#hash, you need location.search
   */
  const redirectLink =
    searchParams.get('redirectLink') || params.get('redirectLink')

  const redirectWebLink = useMemo(() => {
    if (redirectLink === null || fetchStatus !== 'loaded') {
      return null
    }

    const { slug, pathname, hash } = deconstructRedirectLink(redirectLink)
    const { subdomain: subDomainType } = client.getInstanceOptions()

    return generateWebLink({
      cozyUrl: instance,
      subDomainType,
      slug,
      pathname,
      hash,
      searchParams: []
    })
  }, [client, instance, redirectLink, fetchStatus])

  return {
    redirectWebLink,
    redirectLink
  }
}

export { useRedirectLink }
