import React from 'react'
import { Outlet } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout } from 'cozy-ui/transpiled/react/Layout'

import { SelectionProvider } from '@/modules/selection/SelectionProvider'
import UploadQueue from '@/modules/upload/UploadQueue'

const PublicLayout = () => {
  return (
    <Layout>
      <BarComponent replaceTitleOnMobile isPublic disableInternalStore />
      <FlagSwitcher />
      <UploadQueue />
      <SelectionProvider>
        <Outlet />
      </SelectionProvider>
      <Sprite />
    </Layout>
  )
}

export default PublicLayout
