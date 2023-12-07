import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import {
  useClient,
  generateWebLink,
  deconstructRedirectLink
} from 'cozy-client'

import logger from 'lib/logger'
import { changeLocation } from 'drive/hooks/helpers'

/**
 * @typedef {object} ReturnRedirectLink
 * @property {string} redirectLink - The redirect link
 * @property {function} redirectBack - The function to redirect the user
 * @property {boolean} canRedirect - True if the user can be redirected
 */

/**
 * This hook is used to redirect from an OnlyOffice file
 * @param {boolean} isPublic - true if the file is public
 * @returns {ReturnRedirectLink} - The redirect link and the function to redirect from an OnlyOffice file
 */
const useRedirectLink = ({ isPublic = false } = {}) => {
  const [searchParams] = useSearchParams()
  const params = new URLSearchParams(location.search)
  const client = useClient()
  const navigate = useNavigate()

  const isFromPublicFolder = searchParams.get('fromPublicFolder') === 'true'

  const [currentMemberInstance, setCurrentMemberInstance] = useState(undefined)

  useEffect(() => {
    const fetch = async () => {
      try {
        const permissions = await client
          .collection('io.cozy.permissions')
          .fetchOwnPermissions()

        // We gets in included the member of the sharing, corresponding to the user who accessed the file
        // If the file is open on the instance of the share owner, we can retrieve the link to his instance
        if (permissions.included?.length > 0) {
          setCurrentMemberInstance(permissions.included[0].attributes?.instance)
        }
      } catch {
        logger.warn('Cannot fetch permissions')
      }
    }

    if (isPublic && !isFromPublicFolder) {
      fetch()
    }
  }, [client, isPublic, isFromPublicFolder])

  /**
   * We search for redirectLink using two methods because
   * the searchParam differs depending on the position in the url :
   * - for /#hash?searchParam, you need useSearchParams
   * - for /?searchParam#hash, you need location.search
   */
  const redirectLink =
    searchParams.get('redirectLink') || params.get('redirectLink')

  const redirectBack = () => {
    if (!redirectLink) {
      return logger.warn('Cannot find a redirect link')
    }

    const { slug, pathname, hash } = deconstructRedirectLink(redirectLink)

    // As we navigate in the same instance, we can use the react-router-dom navigate
    if (!isPublic || isFromPublicFolder) {
      return navigate(hash)
    }

    // If the file is open on the instance of the share owner, we can redirect the user to his instance
    if (currentMemberInstance) {
      try {
        const { subdomain: subDomainType } = client.getInstanceOptions()
        const link = generateWebLink({
          cozyUrl: currentMemberInstance,
          subDomainType,
          slug,
          pathname,
          hash
        })
        return changeLocation(link)
      } catch (e) {
        logger.error(`Cannot generate a web link : ${e}`)
      }
    }

    /**
     * If file is not open in new tab, we can redirect the user to the previous page
     * There is a double redirection for public file :
     * 1. To know that the file is a share, the other
     * 2. To open it on the host instance
     * so there is an additional entry in the history to skip to access the previous page
     */
    if (window.history.length > 2) {
      return navigate(-2)
    }

    // We do nothing because we don't know where to redirect the user
  }

  const canRedirect =
    !!redirectLink &&
    (!isPublic ||
      isFromPublicFolder ||
      !!currentMemberInstance ||
      window.history.length > 2)

  return {
    redirectLink,
    redirectBack,
    canRedirect
  }
}

export { useRedirectLink }
