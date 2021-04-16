import React from 'react'
import { Layout } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { IconSprite } from 'cozy-ui/transpiled/react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { RouterContextProvider } from 'drive/lib/RouterContext'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'

const PublicLayout = ({ children, ...otherProps }) => {
  const { t } = useI18n()
  return (
    <RouterContextProvider {...otherProps}>
      <Layout>
        <FlagSwitcher />
        <Alerter t={t} />
        {children}
        <IconSprite />
      </Layout>
    </RouterContextProvider>
  )
}

export default PublicLayout
