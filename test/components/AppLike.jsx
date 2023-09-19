import React from 'react'
import { CozyProvider } from 'cozy-client'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { SharingContext } from 'cozy-sharing'

import { ThumbnailSizeContextProvider } from 'drive/lib/ThumbnailSizeContext'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { ModalContext } from 'drive/lib/ModalContext'
import { HashRouter } from 'react-router-dom'
import { AcceptingSharingProvider } from 'drive/lib/AcceptingSharingContext'
import FabProvider from 'drive/lib/FabProvider'
import PushBannerProvider from 'components/PushBanner/PushBannerProvider'
import { SelectionProvider } from 'drive/web/modules/selection/SelectionProvider'
import driveEnLocale from 'drive/locales/en.json'
import photoEnLocale from 'photos/locales/en.json'

const mockStore = createStore(() => ({
  mobile: {
    url: 'cozy-url://'
  }
}))

export const TestI18n = ({ children, enLocale }) => {
  return (
    <I18n lang={'en'} dictRequire={enLocale}>
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
  modalContextValue,
  enLocale
}) => (
  <Provider store={(client && client.store) || store || mockStore}>
    <CozyProvider client={client}>
      <TestI18n enLocale={enLocale}>
        <SharingContext.Provider
          value={sharingContextValue || mockSharingContextValue}
        >
          <AcceptingSharingProvider>
            <HashRouter>
              <SelectionProvider>
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
              </SelectionProvider>
            </HashRouter>
          </AcceptingSharingProvider>
        </SharingContext.Provider>
      </TestI18n>
    </CozyProvider>
  </Provider>
)

const DriveAppLike = props => (
  <AppLike enLocale={() => driveEnLocale} {...props} />
)

export const PhotosAppLike = props => (
  <AppLike enLocale={() => photoEnLocale} {...props} />
)

// For legacy reasons, default is Drive
export default DriveAppLike
