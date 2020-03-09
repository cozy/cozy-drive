import React from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import { CozyProvider } from 'cozy-client'
import { I18n } from 'cozy-ui/transpiled/react/I18n'

import StyledApp from 'drive/web/modules/drive/StyledApp'

const App = props => {
  return (
    <Provider store={props.store}>
      <I18n lang={props.lang} polyglot={props.polyglot}>
        <CozyProvider client={props.client}>
          <StyledApp>{props.children}</StyledApp>
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
