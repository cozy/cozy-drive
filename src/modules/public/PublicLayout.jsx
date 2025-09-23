import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'
import flag from 'cozy-flags'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout } from 'cozy-ui/transpiled/react/Layout'

import { SelectionProvider } from '@/modules/selection/SelectionProvider'
import { NewItemHighlightProvider } from '@/modules/upload/NewItemHighlightProvider'
import UploadQueue from '@/modules/upload/UploadQueue'

const NewItemHighlightProviderWrapper = flag(
  'drive.highlight-new-items.enabled'
)
  ? NewItemHighlightProvider
  : Fragment

const PublicLayout = () => {
  return (
    <Layout>
      <BarComponent replaceTitleOnMobile isPublic disableInternalStore />
      <FlagSwitcher />
      <UploadQueue />
      <NewItemHighlightProviderWrapper>
        <SelectionProvider>
          <Outlet />
        </SelectionProvider>
      </NewItemHighlightProviderWrapper>
      <Sprite />
    </Layout>
  )
}

export default PublicLayout
