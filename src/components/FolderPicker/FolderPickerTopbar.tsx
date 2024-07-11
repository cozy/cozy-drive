import React, { useCallback, useState } from 'react'

import { useClient } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import FolderAddIcon from 'cozy-ui/transpiled/react/Icons/FolderAdd'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getParentFolder } from './helpers'
import BackButton from 'components/Button/BackButton'
import { File } from 'components/FolderPicker/types'
import { ROOT_DIR_ID } from 'constants/config'
import Topbar from 'modules/layout/Topbar'
import { useNextcloudInfos } from 'modules/nextcloud/hooks/useNextcloudInfos'

interface FolderPickerTopbarProps {
  navigateTo: (folder?: import('./types').File) => void
  folder?: File
  showFolderCreation?: () => void
  canCreateFolder?: boolean
  showNextcloudFolder?: boolean
}

const FolderPickerTopbar: React.FC<FolderPickerTopbarProps> = ({
  navigateTo,
  folder,
  showFolderCreation,
  showNextcloudFolder,
  canCreateFolder
}) => {
  const { t } = useI18n()
  const client = useClient()
  const [isNavigating, setNavigating] = useState(false)

  const showBackButton =
    folder !== undefined && (folder._id !== ROOT_DIR_ID || showNextcloudFolder)

  const { instanceName } = useNextcloudInfos({
    sourceAccount: folder?.cozyMetadata?.sourceAccount
  })

  const handleNavigateTo = useCallback(async () => {
    if (!folder) {
      throw Error('Cannot navigate to the parent of inexistant folder')
    }

    setNavigating(true)
    const parentFolder = await getParentFolder(client, folder, {
      instanceName
    })
    navigateTo(parentFolder)
    setNavigating(false)
  }, [client, folder, navigateTo, instanceName])

  const name =
    folder === undefined
      ? t('FolderPickerTopbar.root')
      : folder._id === ROOT_DIR_ID
      ? t('breadcrumb.title_drive')
      : folder.name

  const showCreateFolderButton =
    canCreateFolder &&
    folder !== undefined &&
    folder._type !== 'io.cozy.remote.nextcloud.files'

  return (
    <Topbar hideOnMobile={false}>
      {showBackButton ? (
        <BackButton onClick={handleNavigateTo} disabled={isNavigating} />
      ) : null}
      <Typography variant="h4">{name}</Typography>
      {showCreateFolderButton ? (
        <IconButton
          className="u-ml-auto"
          onClick={showFolderCreation}
          aria-label={t('Move.addFolder')}
        >
          <Icon icon={FolderAddIcon} />
        </IconButton>
      ) : null}
    </Topbar>
  )
}

export { FolderPickerTopbar }
