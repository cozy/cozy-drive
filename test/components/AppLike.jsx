import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { createStore } from 'redux'

import { CozyProvider } from 'cozy-client'
import { SharingContext, NativeFileSharingProvider } from 'cozy-sharing'
import { Layout } from 'cozy-ui/transpiled/react/Layout'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'

import PushBannerProvider from '@/components/PushBanner/PushBannerProvider'
import RightClickProvider from '@/components/RightClick/RightClickProvider'
import ClipboardProvider from '@/contexts/ClipboardProvider'
import { AcceptingSharingProvider } from '@/lib/AcceptingSharingContext'
import FabProvider from '@/lib/FabProvider'
import { ModalContext } from '@/lib/ModalContext'
import { ViewSwitcherContextProvider } from '@/lib/ViewSwitcherContext'
import enLocale from '@/locales/en.json'
import { SelectionProvider } from '@/modules/selection/SelectionProvider'

const mockStore = createStore(() => ({
  mobile: {
    url: 'cozy-url://'
  }
}))

export const TestI18n = ({ children }) => {
  return (
    <I18n lang="en" dictRequire={() => enLocale}>
      {children}
    </I18n>
  )
}

const mockSharingContextValue = {
  refresh: jest.fn(),
  hasWriteAccess: jest.fn(),
  getRecipients: jest.fn().mockReturnValue([]),
  getDocumentPermissions: jest.fn(),
  isOwner: jest.fn(),
  allLoaded: jest.fn(),
  hasSharedParent: jest.fn(),
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
              <NativeFileSharingProvider>
                <HashRouter>
                  <SelectionProvider>
                    <ViewSwitcherContextProvider>
                      <BreakpointsProvider>
                        <AlertProvider>
                          <PushBannerProvider>
                            <ClipboardProvider>
                              <ModalContext.Provider
                                value={
                                  modalContextValue || mockModalContextValue
                                }
                              >
                                <FabProvider>
                                  <RightClickProvider>
                                    <Layout>{children}</Layout>
                                  </RightClickProvider>
                                </FabProvider>
                              </ModalContext.Provider>
                            </ClipboardProvider>
                          </PushBannerProvider>
                        </AlertProvider>
                      </BreakpointsProvider>
                    </ViewSwitcherContextProvider>
                  </SelectionProvider>
                </HashRouter>
              </NativeFileSharingProvider>
            </AcceptingSharingProvider>
          </SharingContext.Provider>
        </TestI18n>
      </CozyProvider>
    </Provider>
  </CozyTheme>
)

export default AppLike
