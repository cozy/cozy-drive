import React from 'react'
import PropTypes from 'prop-types'

import { CozyProvider } from 'cozy-client'
import SharingProvider from 'cozy-sharing'
import { I18n } from 'cozy-ui/transpiled/react/I18n'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import {
  VaultUnlockProvider,
  VaultProvider,
  VaultUnlockPlaceholder
} from 'cozy-keys-lib'
import FabProvider from 'drive/lib/FabProvider'

import StyledApp from 'drive/web/modules/drive/StyledApp'

const DriveProvider = ({
  client,
  vaultClient,
  lang,
  polyglot,
  dictRequire,
  children
}) => {
  return (
    <I18n lang={lang} polyglot={polyglot} dictRequire={dictRequire}>
      <CozyProvider client={client}>
        <VaultProvider client={vaultClient}>
          <VaultUnlockProvider>
            <SharingProvider doctype="io.cozy.files" documentType="Files">
              <BreakpointsProvider>
                <VaultUnlockPlaceholder />
                <FabProvider>
                  <StyledApp>{children}</StyledApp>
                </FabProvider>
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
  vaultClient: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  polyglot: PropTypes.object,
  dictRequire: PropTypes.func
}

export default DriveProvider
