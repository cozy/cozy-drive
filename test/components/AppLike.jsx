import React from 'react'
import { CozyProvider } from 'cozy-client'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { I18n } from 'cozy-ui/transpiled/react'
import { SharingContext } from 'cozy-sharing'

import langEn from 'drive/locales/en.json'
import { ThumbnailSizeContextProvider } from 'drive/lib/ThumbnailSizeContext'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { ModalContext } from 'drive/lib/ModalContext'
import { HashRouter } from 'react-router-dom'
import { AcceptingSharingProvider } from 'drive/lib/AcceptingSharingContext'
import FabProvider from 'drive/lib/FabProvider'
import PushBannerProvider from 'components/PushBanner/PushBannerProvider'

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
  <Provider store={(client && client.store) || store || mockStore}>
    <CozyProvider client={client}>
      <TestI18n>
        <SharingContext.Provider
          value={sharingContextValue || mockSharingContextValue}
        >
          <AcceptingSharingProvider>
            <HashRouter>
              <ThumbnailSizeContextProvider>
                <BreakpointsProvider>
                  <PushBannerProvider>
                    <ModalContext.Provider
                      value={modalContextValue || mockModalContextValue}
                    >
                      <FabProvider>{children}</FabProvider>
                    </ModalContext.Provider>
                  </PushBannerProvider>
                </BreakpointsProvider>
              </ThumbnailSizeContextProvider>
            </HashRouter>
          </AcceptingSharingProvider>
        </SharingContext.Provider>
      </TestI18n>
    </CozyProvider>
  </Provider>
)

export default AppLike
