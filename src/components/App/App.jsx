import PropTypes from 'prop-types'
import React from 'react'
import { Provider } from 'react-redux'

import { BarProvider } from 'cozy-bar'
import { DataProxyProvider } from 'cozy-dataproxy-lib'
import { WebviewIntentProvider } from 'cozy-intent'

import PushBannerProvider from 'components/PushBanner/PushBannerProvider'
import { AcceptingSharingProvider } from 'lib/AcceptingSharingContext'
import DriveProvider from 'lib/DriveProvider'
import { ModalContextProvider } from 'lib/ModalContext'
import { ThumbnailSizeContextProvider } from 'lib/ThumbnailSizeContext'
import { PublicProvider } from 'modules/public/PublicProvider'
import { onFileUploaded } from 'modules/views/Upload/UploadUtils'

const App = ({ isPublic, store, client, lang, polyglot, children }) => {
  return (
    <WebviewIntentProvider
      methods={{
        onFileUploaded: (file, isSuccess) =>
          onFileUploaded({ file, isSuccess }, store.dispatch)
      }}
    >
      <PublicProvider isPublic={isPublic}>
        <BarProvider>
          <Provider store={store}>
            <DriveProvider client={client} lang={lang} polyglot={polyglot}>
              <PushBannerProvider>
                <AcceptingSharingProvider>
                  <ThumbnailSizeContextProvider>
                    <ModalContextProvider>
                      {isPublic ? (
                        children
                      ) : (
                        <DataProxyProvider>{children}</DataProxyProvider>
                      )}
                    </ModalContextProvider>
                  </ThumbnailSizeContextProvider>
                </AcceptingSharingProvider>
              </PushBannerProvider>
            </DriveProvider>
          </Provider>
        </BarProvider>
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
