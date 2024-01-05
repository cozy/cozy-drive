import React from 'react'
import { CozyProvider } from 'cozy-client'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { SharingContext } from 'cozy-sharing'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'

import { ThumbnailSizeContextProvider } from 'lib/ThumbnailSizeContext'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { ModalContext } from 'lib/ModalContext'
import { HashRouter } from 'react-router-dom'
import { AcceptingSharingProvider } from 'lib/AcceptingSharingContext'
import FabProvider from 'lib/FabProvider'
import PushBannerProvider from 'components/PushBanner/PushBannerProvider'
import { SelectionProvider } from 'modules/selection/SelectionProvider'
import enLocale from 'locales/en.json'

const mockStore = createStore(() => ({
  mobile: {
    url: 'cozy-url://'
  }
}))

export const TestI18n = ({ children }) => {
  return (
    <I18n lang={'en'} dictRequire={() => enLocale}>
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

const mockModalContextValue = {
  pushModal: jest.fn(),
  modalStack: []
}

const AppLike = ({
  children,
  store,
  client,
  sharingContextValue,
  modalContextValue
}) => (
  <CozyTheme>
    <Provider store={store || (client && client.store) || mockStore}>
      <CozyProvider client={client}>
        <TestI18n>
          <SharingContext.Provider
            value={sharingContextValue || mockSharingContextValue}
          >
            <AcceptingSharingProvider>
              <HashRouter>
                <SelectionProvider>
                  <ThumbnailSizeContextProvider>
                    <BreakpointsProvider>
                      <AlertProvider>
                        <PushBannerProvider>
                          <ModalContext.Provider
                            value={modalContextValue || mockModalContextValue}
                          >
                            <FabProvider>{children}</FabProvider>
                          </ModalContext.Provider>
                        </PushBannerProvider>
                      </AlertProvider>
                    </BreakpointsProvider>
                  </ThumbnailSizeContextProvider>
                </SelectionProvider>
              </HashRouter>
            </AcceptingSharingProvider>
          </SharingContext.Provider>
        </TestI18n>
      </CozyProvider>
    </Provider>
  </CozyTheme>
)

export default AppLike
