import React from 'react'
import { I18n } from 'cozy-ui/transpiled/react'
import { CozyProvider } from 'cozy-client'
import { Provider } from 'react-redux'
import langEn from 'drive/locales/en.json'
import { createStore } from 'redux'

const mockStore = createStore(() => ({
  mobile: {
    url: 'cozy-url://'
  }
}))
export const TestI18n = ({ children }) => {
  return (
    <I18n lang={'en'} dictRequire={() => langEn}>
      {children}
    </I18n>
  )
}

const AppLike = ({ children, store, client }) => (
  <Provider store={(client && client.store) || store || mockStore}>
    <CozyProvider client={client}>
      <TestI18n>{children}</TestI18n>
    </CozyProvider>
  </Provider>
)

export default AppLike
