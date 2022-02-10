import React from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import DriveProvider from 'drive/lib/DriveProvider'
import { ThumbnailSizeContextProvider } from 'drive/lib/ThumbnailSizeContext'
import { ModalContextProvider } from 'drive/lib/ModalContext'
import { AcceptingSharingProvider } from 'drive/lib/AcceptingSharingContext'
import { WebviewIntentProvider } from 'cozy-intent'

const App = ({ store, client, lang, polyglot, children }) => {
  return (
    <WebviewIntentProvider>
      <Provider store={store}>
        <DriveProvider client={client} lang={lang} polyglot={polyglot}>
          <AcceptingSharingProvider>
            <ThumbnailSizeContextProvider>
              <ModalContextProvider>{children}</ModalContextProvider>
            </ThumbnailSizeContextProvider>
          </AcceptingSharingProvider>
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
