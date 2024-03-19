import PropTypes from 'prop-types'
import React from 'react'

import { CozyProvider } from 'cozy-client'
import {
  VaultUnlockProvider,
  VaultProvider,
  VaultUnlockPlaceholder
} from 'cozy-keys-lib'
import SharingProvider from 'cozy-sharing'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'

import FabProvider from 'lib/FabProvider'
import { ScannerI18nProvider } from 'lib/ScannerI18nProvider'
import StyledApp from 'modules/drive/StyledApp'

const DriveProvider = ({ client, lang, polyglot, dictRequire, children }) => {
  return (
    <I18n lang={lang} polyglot={polyglot} dictRequire={dictRequire}>
      <ScannerI18nProvider>
        <CozyProvider client={client}>
          <VaultProvider cozyClient={client}>
            <VaultUnlockProvider>
              <SharingProvider doctype="io.cozy.files" documentType="Files">
                <BreakpointsProvider>
                  <AlertProvider>
                    <VaultUnlockPlaceholder />
                    <FabProvider>
                      <StyledApp>{children}</StyledApp>
                    </FabProvider>
                  </AlertProvider>
                </BreakpointsProvider>
              </SharingProvider>
            </VaultUnlockProvider>
          </VaultProvider>
        </CozyProvider>
      </ScannerI18nProvider>
    </I18n>
  )
}

DriveProvider.propTypes = {
  client: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  polyglot: PropTypes.object,
  dictRequire: PropTypes.func
}

export default DriveProvider
