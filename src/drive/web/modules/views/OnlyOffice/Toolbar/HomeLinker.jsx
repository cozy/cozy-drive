import React from 'react'

import {
  useClient,
  useQuery,
  isQueryLoading,
  generateWebLink
} from 'cozy-client'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import {
  buildAppsQuery,
  buildSettingsByIdQuery
} from 'drive/web/modules/queries'
import { computeHomeApp } from 'drive/web/modules/views/OnlyOffice/Toolbar/helpers'

const HomeLinker = ({ children }) => {
  const { t } = useI18n()
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

  const homeHref = generateWebLink({
    cozyUrl: client.getStackClient().uri,
    slug: homeApp.slug,
    pathname: '/',
    subDomainType: client.getInstanceOptions().subdomain
  })

  return (
    <AppLinker app={homeApp} href={homeHref}>
      {({ onClick, href }) => (
        <a
          href={href}
          onClick={onClick}
          aria-label={t('OnlyOffice.toolbar.goToHome')}
        >
          {children}
        </a>
      )}
    </AppLinker>
  )
}

export default HomeLinker
