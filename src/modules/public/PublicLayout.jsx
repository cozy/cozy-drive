import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import UploadQueue from 'modules/upload/UploadQueue'
import { SelectionProvider } from 'modules/selection/SelectionProvider'

const PublicLayout = () => {
  const { t } = useI18n()
  return (
    <Layout>
      <FlagSwitcher />
      <Alerter t={t} />
      <UploadQueue />
      <SelectionProvider>
        <Outlet />
      </SelectionProvider>
      <Sprite />
    </Layout>
  )
}

export default PublicLayout
