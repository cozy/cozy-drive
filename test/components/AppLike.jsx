import React from 'react'
import { I18n } from 'cozy-ui/transpiled/react'
import { CozyProvider } from 'cozy-client'
import { Provider } from 'react-redux'
import langEn from 'drive/locales/en.json'
import { createStore } from 'redux'
import { ThumbnailSizeContextProvider } from 'drive/lib/ThumbnailSizeContext'
import { BreakpointsProvider } from 'cozy-ui/react/hooks/useBreakpoints'
import { ModalContext } from 'drive/lib/ModalContext'
import { SharingContext } from 'cozy-sharing'
import { RouterContext } from 'drive/lib/RouterContext'

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

const mockSharingContextValue = {
  refresh: jest.fn(),
  hasWriteAccess: jest.fn(),
  getRecipients: jest.fn(),
  getSharingLink: jest.fn()
}

const mockRouterContextValue = {
  router: {
    push: jest.fn()
  },
  params: {},
  location: { pathname: '' },
  routes: {}
}

const mockModalContextValue = {
  pushModal: jest.fn(),
  modalStack: []
}

const AppLike = ({
  children,
  store,
  client,
  sharingContextValue,
  routerContextValue,
  modalContextValue
}) => (
  <Provider store={(client && client.store) || store || mockStore}>
    <CozyProvider client={client}>
      <TestI18n>
        <SharingContext.Provider
          value={sharingContextValue || mockSharingContextValue}
        >
          <RouterContext.Provider
            value={routerContextValue || mockRouterContextValue}
          >
            <ThumbnailSizeContextProvider>
              <BreakpointsProvider>
                <ModalContext.Provider
                  value={modalContextValue || mockModalContextValue}
                >
                  {children}
                </ModalContext.Provider>
              </BreakpointsProvider>
            </ThumbnailSizeContextProvider>
          </RouterContext.Provider>
        </SharingContext.Provider>
      </TestI18n>
    </CozyProvider>
  </Provider>
)

export default AppLike
