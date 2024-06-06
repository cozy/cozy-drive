import PropTypes from 'prop-types'
import React, { useCallback } from 'react'

import { useClient } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import FolderAddIcon from 'cozy-ui/transpiled/react/Icons/FolderAdd'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getParentFolderFromPath } from './helpers'
import BackButton from 'components/Button/BackButton'
import { ROOT_DIR_ID } from 'constants/config'
import Topbar from 'modules/layout/Topbar'
import { buildOnlyFolderQuery } from 'modules/queries'

const FolderPickerTopbar = ({
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

  const handleNavigateTo = useCallback(async () => {
    if (folder._id === ROOT_DIR_ID) {
      return navigateTo()
    }

    if (folder.dir_id) {
      const parentFolderQuery = buildOnlyFolderQuery(folder.dir_id)
      const parentFolder = await client.fetchQueryAndGetFromState({
        definition: parentFolderQuery.definition(),
        options: parentFolderQuery.options
      })

      return navigateTo(parentFolder.data)
    }

    if (
      folder._type === 'io.cozy.remote.nextcloud.files' &&
      folder.path == '/' &&
      showNextcloudFolder
    ) {
      return navigateTo()
    }

    if (
      folder._type === 'io.cozy.remote.nextcloud.files' &&
      showNextcloudFolder
    ) {
      const parentFolder = {
        _type: 'io.cozy.remote.nextcloud.files',
        ...getParentFolderFromPath(folder.path),
        cozyMetadata: {
          sourceAccount: folder.cozyMetadata.sourceAccount
        }
      }

      return navigateTo(parentFolder)
    }
  }, [client, folder, navigateTo, showNextcloudFolder])

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

FolderPickerTopbar.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  folder: PropTypes.object,
  showFolderCreation: PropTypes.func,
  canCreateFolder: PropTypes.bool,
  showNextcloudFolder: PropTypes.bool
}

export { FolderPickerTopbar }
