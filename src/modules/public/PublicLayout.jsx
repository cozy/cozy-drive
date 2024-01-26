import React from 'react'
import { Outlet } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { SelectionProvider } from 'modules/selection/SelectionProvider'
import UploadQueue from 'modules/upload/UploadQueue'

const PublicLayout = () => {
  const { t } = useI18n()

  return (
    <Layout>
      <BarComponent replaceTitleOnMobile isPublic />
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
