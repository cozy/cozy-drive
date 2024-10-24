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
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'

import FabProvider from 'lib/FabProvider'
import { usePublicContext } from 'modules/public/PublicProvider'

const DriveProvider = ({ client, lang, polyglot, dictRequire, children }) => {
  const { isPublic } = usePublicContext()

  return (
    <I18n lang={lang} polyglot={polyglot} dictRequire={dictRequire}>
      <CozyProvider client={client}>
        <VaultProvider cozyClient={client}>
          <VaultUnlockProvider>
            <SharingProvider doctype="io.cozy.files" documentType="Files">
              <CozyTheme ignoreCozySettings={isPublic} className="u-w-100">
                <BreakpointsProvider>
                  <AlertProvider>
                    <VaultUnlockPlaceholder />
                    <FabProvider>{children}</FabProvider>
                  </AlertProvider>
                </BreakpointsProvider>
              </CozyTheme>
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
