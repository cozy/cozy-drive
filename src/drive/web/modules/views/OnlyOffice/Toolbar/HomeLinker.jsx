import React from 'react'

import { useClient, useQuery, isQueryLoading } from 'cozy-client'
import AppLinker, { generateWebLink } from 'cozy-ui/transpiled/react/AppLinker'

import {
  buildAppsQuery,
  buildSettingsByIdQuery
} from 'drive/web/modules/queries'

// TODO: use this method from cozy-client instead
const computeHomeApp = ({ apps, context }) => {
  const defaultRedirection =
    context && context.attributes && context.attributes.default_redirection
  let homeApp = null

  if (!defaultRedirection) {
    homeApp = apps.find(app => app.slug === 'home')
  } else {
    const slugRegexp = /^([^/]+)\/.*/
    const matches = defaultRedirection.match(slugRegexp)
    const defaultAppSlug = matches && matches[1]
    homeApp = apps.find(app => app.slug === defaultAppSlug)
  }

  return homeApp
}

const HomeLinker = ({ children }) => {
  const client = useClient()
  const appsQuery = buildAppsQuery()
  const contextQuery = buildSettingsByIdQuery('context')
  const appsResult = useQuery(appsQuery.definition, appsQuery.options)
  const contextResult = useQuery(contextQuery.definition, contextQuery.options)

  if (isQueryLoading(appsResult) || isQueryLoading(contextResult)) {
    return <>{children}</>
  }

  const homeApp = computeHomeApp({
    apps: appsResult.data,
    context: contextResult.data
  })
  const homeSlug = homeApp.slug
  const homeHref = generateWebLink({
    cozyUrl: client.getStackClient().uri,
    slug: homeSlug,
    subDomainType: client.getInstanceOptions().cozySubdomainType
  })

  return (
    <AppLinker slug={homeSlug} href={homeHref}>
      {({ onClick, href }) => (
        <a href={href} onClick={onClick}>
          {children}
        </a>
      )}
    </AppLinker>
  )
}

export default HomeLinker
