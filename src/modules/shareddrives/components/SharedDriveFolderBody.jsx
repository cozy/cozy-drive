import React from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'
import { useSharingContext } from 'cozy-sharing'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { download, infos, versions, hr } from '@/modules/actions'
import { duplicateTo } from '@/modules/actions/components/duplicateTo'
import { FolderBody } from '@/modules/folder/components/FolderBody'

const SharedDriveFolderBody = ({
  folderId,
  queryResults,
  refreshFolderContent
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const client = useClient()
  const vaultClient = useVaultClient()
  const { driveId } = useParams()
  const { t } = useI18n()
  const { isOwner } = useSharingContext()
  const { isMobile } = useBreakpoints()
  const { showAlert } = useAlert()

  const actionsOptions = {
    client,
    t,
    vaultClient,
    pathname,
    isOwner,
    isMobile,
    driveId,
    navigate,
    showAlert
  }
  const actions = makeActions(
    [download, hr, duplicateTo, infos, hr, versions, hr],
    actionsOptions
  )

  return (
    <FolderBody
      folderId={folderId}
      queryResults={queryResults}
      actions={actions}
      withFilePath={false}
      driveId={driveId}
      refreshFolderContent={refreshFolderContent}
    />
  )
}

export { SharedDriveFolderBody }
