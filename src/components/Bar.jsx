import React from 'react'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import cx from 'classnames'
import cozyBar from 'lib/cozyBar'
import { VaultUnlockProvider, VaultProvider } from 'cozy-keys-lib'
import BarContextProvider from 'cozy-ui/transpiled/react/BarContextProvider'
import { RouterContext, useRouter } from 'drive/lib/RouterContext'
import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { useWebviewIntent } from 'cozy-intent'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const wrap = (Component, className) => {
  const WrappedBarComponent = ({ children }) => {
    return (
      <Component>
        <CozyTheme
          className={cx('u-flex u-flex-items-center', className)}
          variant="normal"
        >
          {children}
        </CozyTheme>
      </Component>
    )
  }
  return WrappedBarComponent
}

export const BarCenter = wrap(cozyBar.BarCenter, 'u-ellipsis')
export const BarRight = wrap(cozyBar.BarRight)
export const BarLeft = wrap(cozyBar.BarLeft)
export const BarSearch = wrap(cozyBar.BarSearch, 'u-flex-grow')

export const BarRightWithProvider = ({ store, children }) => {
  const client = useClient()
  const { router, params, location, routes } = useRouter()
  const { t, lang } = useI18n()
  const webviewIntent = useWebviewIntent()
  const { isMobile } = useBreakpoints()

  if (isMobile) {
    return (
      <BarRight>
        <BarContextProvider
          client={client}
          store={store || client.store}
          t={t}
          lang={lang}
          webviewService={webviewIntent}
        >
          <RouterContext.Provider value={{ router, params, location, routes }}>
            <VaultProvider cozyClient={client}>
              <VaultUnlockProvider>{children}</VaultUnlockProvider>
            </VaultProvider>
          </RouterContext.Provider>
        </BarContextProvider>
      </BarRight>
    )
  }

  return <>{children}</>
}
