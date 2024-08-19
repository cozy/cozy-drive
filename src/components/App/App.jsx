import PropTypes from 'prop-types'
import React from 'react'
import { Provider } from 'react-redux'

import { BarProvider } from 'cozy-bar'
import { WebviewIntentProvider } from 'cozy-intent'

import PushBannerProvider from 'components/PushBanner/PushBannerProvider'
import { AcceptingSharingProvider } from 'lib/AcceptingSharingContext'
import DriveProvider from 'lib/DriveProvider'
import { ModalContextProvider } from 'lib/ModalContext'
import { ThumbnailSizeContextProvider } from 'lib/ThumbnailSizeContext'
import { onFileUploaded } from 'modules/views/Upload/UploadUtils'

const App = ({ isPublic = false, store, client, lang, polyglot, children }) => {
  return (
    <WebviewIntentProvider
      methods={{
        onFileUploaded: (file, isSuccess) =>
          onFileUploaded({ file, isSuccess }, store.dispatch)
      }}
    >
      <BarProvider>
        <Provider store={store}>
          <DriveProvider
            isPublic={isPublic}
            client={client}
            lang={lang}
            polyglot={polyglot}
          >
            <PushBannerProvider>
              <AcceptingSharingProvider>
                <ThumbnailSizeContextProvider>
                  <ModalContextProvider>{children}</ModalContextProvider>
                </ThumbnailSizeContextProvider>
              </AcceptingSharingProvider>
            </PushBannerProvider>
          </DriveProvider>
        </Provider>
      </BarProvider>
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
