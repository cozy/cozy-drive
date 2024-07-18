import get from 'lodash/get'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useClient, useCapabilities } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'
import { useWebviewIntent } from 'cozy-intent'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import createFileOpeningHandler from 'modules/views/Folder/createFileOpeningHandler'
import { isOfficeEnabled as computeOfficeEnabled } from 'modules/views/OnlyOffice/helpers'

interface useFileOpeningHandlerProps {
  isPublic: boolean
  navigateToFile: (file: IOCozyFile) => void
}

interface useFileOpeningHandlerReturn {
  handleFileOpen: (args: {
    event: React.MouseEvent<HTMLInputElement>
    file: IOCozyFile
  }) => Promise<void>
}

const useFileOpeningHandler = ({
  isPublic,
  navigateToFile
}: useFileOpeningHandlerProps): useFileOpeningHandlerReturn => {
  const client = useClient()
  const { pathname } = useLocation()
  const { capabilities } = useCapabilities(client)
  const isFlatDomain = get(capabilities, 'flat_subdomains')
  const navigate = useNavigate()
  const { isDesktop } = useBreakpoints()
  const webviewIntent = useWebviewIntent()
  const { t } = useI18n()
  const { showAlert } = useAlert()

  const isOfficeEnabled = computeOfficeEnabled(isDesktop)

  const handleFileOpen = useCallback(
    ({
      event,
      file
    }: {
      event: React.MouseEvent<HTMLInputElement>
      file: IOCozyFile
    }) => {
      return createFileOpeningHandler({
        client,
        isFlatDomain,
        navigateToFile,
        replaceCurrentUrl: (url: string) => (window.location.href = url),
        openInNewTab: (url: string) => window.open(url, '_blank'),
        routeTo: (url: string) => navigate(url),
        isOfficeEnabled,
        webviewIntent,
        pathname,
        showAlert,
        t,
        fromPublicFolder: isPublic
      })({ event, file })
    },
    [
      client,
      isFlatDomain,
      navigateToFile,
      isOfficeEnabled,
      webviewIntent,
      pathname,
      showAlert,
      t,
      isPublic,
      navigate
    ]
  )

  return {
    handleFileOpen
  }
}

export { useFileOpeningHandler }
