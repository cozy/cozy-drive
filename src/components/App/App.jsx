import React from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import { CozyProvider } from 'cozy-client'
import { I18n } from 'cozy-ui/transpiled/react/I18n'
import { BreakpointsProvider } from 'cozy-ui/react/hooks/useBreakpoints'
import SharingProvider from 'cozy-sharing'
import { ThumbnailSizeContextProvider } from 'drive/lib/ThumbnailSizeContext'
import { ModalContextProvider } from 'drive/lib/ModalContext'

import StyledApp from 'drive/web/modules/drive/StyledApp'

const App = props => {
  return (
    <Provider store={props.store}>
      <I18n lang={props.lang} polyglot={props.polyglot}>
        <CozyProvider client={props.client}>
          <SharingProvider doctype="io.cozy.files" documentType="Files">
            <ThumbnailSizeContextProvider>
              <ModalContextProvider>
                <BreakpointsProvider>
                  <StyledApp>{props.children}</StyledApp>
                </BreakpointsProvider>
              </ModalContextProvider>
            </ThumbnailSizeContextProvider>
          </SharingProvider>
        </CozyProvider>
      </I18n>
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
