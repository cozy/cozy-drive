import React from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import { WebviewIntentProvider } from 'cozy-intent'

import DriveProvider from 'lib/DriveProvider'
import { ThumbnailSizeContextProvider } from 'lib/ThumbnailSizeContext'
import { ModalContextProvider } from 'lib/ModalContext'
import { AcceptingSharingProvider } from 'lib/AcceptingSharingContext'
import PushBannerProvider from 'components/PushBanner/PushBannerProvider'
import cozyBar from 'lib/cozyBar'
import { onFileUploaded } from 'drive/web/modules/views/Upload/UploadUtils'

const App = ({ store, client, lang, polyglot, children }) => {
  return (
    <WebviewIntentProvider
      setBarContext={cozyBar.setWebviewContext}
      methods={{
        onFileUploaded: (file, isSuccess) =>
          onFileUploaded({ file, isSuccess }, store.dispatch)
      }}
    >
      <Provider store={store}>
        <DriveProvider client={client} lang={lang} polyglot={polyglot}>
          <PushBannerProvider>
            <AcceptingSharingProvider>
              <ThumbnailSizeContextProvider>
                <ModalContextProvider>{children}</ModalContextProvider>
              </ThumbnailSizeContextProvider>
            </AcceptingSharingProvider>
          </PushBannerProvider>
        </DriveProvider>
      </Provider>
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
