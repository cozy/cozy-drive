import React from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import DriveProvider from 'drive/lib/DriveProvider'
import { ThumbnailSizeContextProvider } from 'drive/lib/ThumbnailSizeContext'
import { ModalContextProvider } from 'drive/lib/ModalContext'
import { AcceptingSharingProvider } from 'drive/lib/AcceptingSharingContext'

const App = ({ store, client, vaultClient, lang, polyglot, children }) => {
  return (
    <Provider store={store}>
      <DriveProvider
        client={client}
        vaultClient={vaultClient}
        lang={lang}
        polyglot={polyglot}
      >
        <AcceptingSharingProvider>
          <ThumbnailSizeContextProvider>
            <ModalContextProvider>{children}</ModalContextProvider>
          </ThumbnailSizeContextProvider>
        </AcceptingSharingProvider>
      </DriveProvider>
    </Provider>
  )
}

App.propTypes = {
  store: PropTypes.object,
  lang: PropTypes.string,
  polyglot: PropTypes.object,
  client: PropTypes.object
}
export default App
