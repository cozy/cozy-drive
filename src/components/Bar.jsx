import cx from 'classnames'
import React from 'react'

import { useClient } from 'cozy-client'
import { useWebviewIntent } from 'cozy-intent'
import { VaultUnlockProvider, VaultProvider } from 'cozy-keys-lib'
import BarContextProvider from 'cozy-ui/transpiled/react/BarContextProvider'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import cozyBar from 'lib/cozyBar'

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
          <VaultProvider cozyClient={client}>
            <VaultUnlockProvider>
              <AlertProvider>{children}</AlertProvider>
            </VaultUnlockProvider>
          </VaultProvider>
        </BarContextProvider>
      </BarRight>
    )
  }

  return <>{children}</>
}
