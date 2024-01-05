import React from 'react'
import PropTypes from 'prop-types'

import { CozyProvider } from 'cozy-client'
import SharingProvider from 'cozy-sharing'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import {
  VaultUnlockProvider,
  VaultProvider,
  VaultUnlockPlaceholder
} from 'cozy-keys-lib'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'

import FabProvider from 'lib/FabProvider'
import StyledApp from 'drive/web/modules/drive/StyledApp'

const DriveProvider = ({ client, lang, polyglot, dictRequire, children }) => {
  return (
    <I18n lang={lang} polyglot={polyglot} dictRequire={dictRequire}>
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
