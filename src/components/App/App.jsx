import React from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import { WebviewIntentProvider } from 'cozy-intent'

import DriveProvider from 'drive/lib/DriveProvider'
import { ThumbnailSizeContextProvider } from 'drive/lib/ThumbnailSizeContext'
import { ModalContextProvider } from 'drive/lib/ModalContext'
import { AcceptingSharingProvider } from 'drive/lib/AcceptingSharingContext'
import PushBannerProvider from 'components/PushBanner/PushBannerProvider'
import cozyBar from 'lib/cozyBar'

const App = ({ store, client, lang, polyglot, children }) => {
  return (
    <WebviewIntentProvider
      setBarContext={cozyBar.setWebviewContext}
      methods={{
        onFileUploaded: (file, isSuccess, isLast) => {
          window.postMessage({ file, isSuccess, isLast })
          return Promise.resolve(true)
        }
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
