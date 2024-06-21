import React, { useCallback } from 'react'

import { useClient } from 'cozy-client'
import { NextcloudFile } from 'cozy-client/types/types'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import FolderAddIcon from 'cozy-ui/transpiled/react/Icons/FolderAdd'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import BackButton from 'components/Button/BackButton'
import { File, IOCozyFileWithExtra } from 'components/FolderPicker/types'
import { ROOT_DIR_ID } from 'constants/config'
import { getParentPath } from 'lib/path'
import Topbar from 'modules/layout/Topbar'
import { useNextcloudInfos } from 'modules/nextcloud/hooks/useNextcloudInfos'
import { buildNextcloudFolderQuery } from 'modules/nextcloud/queries'
import { buildOnlyFolderQuery } from 'modules/queries'

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

  const showBackButton =
    folder !== undefined && (folder._id !== ROOT_DIR_ID || showNextcloudFolder)

  const { rootFolderName } = useNextcloudInfos({
    sourceAccount: folder?.cozyMetadata?.sourceAccount
  })

  const handleNavigateTo = useCallback(async () => {
    if (folder?._id === ROOT_DIR_ID) {
      return navigateTo()
    }

    if (folder?._type === 'io.cozy.files' && folder.dir_id) {
      const parentFolderQuery = buildOnlyFolderQuery(folder.dir_id)
      const parentFolder = (await client?.fetchQueryAndGetFromState({
        definition: parentFolderQuery.definition(),
        options: parentFolderQuery.options
      })) as {
        data?: IOCozyFileWithExtra
      }

      return navigateTo(parentFolder.data)
    }

    if (
      folder?._type === 'io.cozy.remote.nextcloud.files' &&
      folder.path === '/' &&
      showNextcloudFolder
    ) {
      return navigateTo()
    }

    if (
      folder?._type === 'io.cozy.remote.nextcloud.files' &&
      showNextcloudFolder
    ) {
      if (folder.parentPath === '/') {
        return navigateTo({
          id: 'io.cozy.remote.nextcloud.files.root-dir',
          _id: 'io.cozy.remote.nextcloud.files.root-dir',
          _type: 'io.cozy.remote.nextcloud.files',
          name: rootFolderName ?? '(Nextcloud)',
          path: '/',
          parentPath: '',
          type: 'directory',
          cozyMetadata: {
            sourceAccount: folder.cozyMetadata.sourceAccount
          }
        })
      } else {
        const parentFolderQuery = buildNextcloudFolderQuery({
          sourceAccount: folder.cozyMetadata.sourceAccount,
          path: getParentPath(folder.parentPath)
        })
        const parentFolderResult = (await client?.fetchQueryAndGetFromState({
          definition: parentFolderQuery.definition(),
          options: parentFolderQuery.options
        })) as {
          data?: NextcloudFile[]
        }
        const parentFolder = (parentFolderResult.data ?? []).find(
          file => file.path === folder.parentPath
        )

        return navigateTo(parentFolder)
      }
    }
  }, [client, folder, navigateTo, rootFolderName, showNextcloudFolder])

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
      {showBackButton ? <BackButton onClick={handleNavigateTo} /> : null}
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
