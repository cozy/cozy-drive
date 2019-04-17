import React from 'react'
import { I18n, initTranslation } from 'cozy-ui/react/I18n'
import { CozyProvider } from 'cozy-client'
import { hot } from 'react-hot-loader'
import DriveMobileRouter from 'drive/mobile/modules/authorization/DriveMobileRouter'

const App = props => (
  <DriveMobileRouter history={props.history} onboarding={props.onboarding} />
)

//const HotedApp = hot(module)(App)
const RootApp = props => (
  <I18n
    lang={props.lang}
    polyglot={props.polyglot}
    store={props.store}
    client={props.client}
    history={props.history}
    onboarding={props.onboarding}
  >
    <CozyProvider store={props.store} client={props.client}>
      <App history={props.history} onboarding={props.onboarding} />
    </CozyProvider>
  </I18n>
)

export default RootApp
