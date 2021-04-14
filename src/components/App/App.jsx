import React from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import DriveProvider from 'drive/lib/DriveProvider'
import { ThumbnailSizeContextProvider } from 'drive/lib/ThumbnailSizeContext'
import { ModalContextProvider } from 'drive/lib/ModalContext'
import { AcceptingSharingProvider } from 'drive/lib/AcceptingSharingContext'

const App = props => {
  return (
    <Provider store={props.store}>
      <DriveProvider
        client={props.client}
        lang={props.lang}
        polyglot={props.polyglot}
      >
        <AcceptingSharingProvider>
          <ThumbnailSizeContextProvider>
            <ModalContextProvider>{props.children}</ModalContextProvider>
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
