import React from 'react'
import { Layout } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { RouterContextProvider } from 'drive/lib/RouterContext'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import UploadQueue from 'drive/web/modules/upload/UploadQueue'

const PublicLayout = ({ children, ...otherProps }) => {
  const { t } = useI18n()
  return (
    <RouterContextProvider {...otherProps}>
      <Layout>
        <FlagSwitcher />
        <Alerter t={t} />
        <UploadQueue />

        {children}
        <Sprite />
      </Layout>
    </RouterContextProvider>
  )
}

export default PublicLayout
