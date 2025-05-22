import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Provider } from 'react-redux'

import { BarProvider } from 'cozy-bar'
import { DataProxyProvider } from 'cozy-dataproxy-lib'
import flag from 'cozy-flags'
import { WebviewIntentProvider } from 'cozy-intent'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import PushBannerProvider from '@/components/PushBanner/PushBannerProvider'
import { AcceptingSharingProvider } from '@/lib/AcceptingSharingContext'
import DriveProvider from '@/lib/DriveProvider'
import { ModalContextProvider } from '@/lib/ModalContext'
import { ThumbnailSizeContextProvider } from '@/lib/ThumbnailSizeContext'
import { DOCTYPE_APPS, DOCTYPE_CONTACTS, DOCTYPE_FILES } from '@/lib/doctypes'
import { PublicProvider } from '@/modules/public/PublicProvider'
import { onFileUploaded } from '@/modules/views/Upload/UploadUtils'

const Providers = ({ children }) => {
  const { isMobile } = useBreakpoints()

  const [DnDProvider, dnDProviderProps] =
    flag('drive.virtualization.enabled') && !isMobile
      ? [DndProvider, { backend: HTML5Backend }]
      : [Fragment, {}]

  return (
    <DataProxyProvider
      options={{
        doctypes: [DOCTYPE_FILES, DOCTYPE_CONTACTS, DOCTYPE_APPS]
      }}
    >
      <BarProvider>
        <PushBannerProvider>
          <AcceptingSharingProvider>
            <ThumbnailSizeContextProvider>
              <ModalContextProvider>
                <DnDProvider {...dnDProviderProps}>{children}</DnDProvider>
              </ModalContextProvider>
            </ThumbnailSizeContextProvider>
          </AcceptingSharingProvider>
        </PushBannerProvider>
      </BarProvider>
    </DataProxyProvider>
  )
}

const App = ({ isPublic, store, client, lang, polyglot, children }) => {
  return (
    <WebviewIntentProvider
      methods={{
        onFileUploaded: (file, isSuccess) =>
          onFileUploaded({ file, isSuccess }, store.dispatch)
      }}
    >
      <PublicProvider isPublic={isPublic}>
        <Provider store={store}>
          <DriveProvider client={client} lang={lang} polyglot={polyglot}>
            <Providers>{children}</Providers>
          </DriveProvider>
        </Provider>
      </PublicProvider>
    </WebviewIntentProvider>
  )
}

App.propTypes = {
  store: PropTypes.object,
  lang: PropTypes.string,
  polyglot: PropTypes.object,
  client: PropTypes.object
}
export default App
