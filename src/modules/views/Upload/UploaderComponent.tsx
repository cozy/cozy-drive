import React from 'react'

import { hasQueryBeenLoaded, useQuery } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FolderPicker } from 'components/FolderPicker/FolderPicker'
import { ROOT_DIR_ID } from 'constants/config'
import { buildOnlyFolderQuery } from 'modules/queries'
import { shouldRender } from 'modules/views/Upload/UploadUtils'
import { useUploadFromFlagship } from 'modules/views/Upload/useUploadFromFlagship'

const UploaderComponent = (): JSX.Element | null => {
  const { t } = useI18n()
  const { items, uploadFilesFromFlagship, onClose, uploadInProgress } =
    useUploadFromFlagship()

  const handleConfirm = (folder: IOCozyFile): void => {
    uploadFilesFromFlagship(folder._id)
  }

  const rootFolderQuery = buildOnlyFolderQuery(ROOT_DIR_ID)
  const rootFolderResult = useQuery(
    rootFolderQuery.definition,
    rootFolderQuery.options
  )

  // If there are no items to render, we display a spinner with a full screen dialog to hide the UI behind
  if (!shouldRender(items) && hasQueryBeenLoaded(rootFolderResult)) {
    return (
      <FixedDialog
        className="u-p-0"
        open
        size="large"
        content={<Spinner size="xxlarge" noMargin middle />}
      />
    )
  }

  return (
    <FolderPicker
      currentFolder={rootFolderResult.data}
      entries={items}
      canCreateFolder={false}
      onConfirm={handleConfirm}
      onClose={onClose}
      isBusy={uploadInProgress}
      slotProps={{
        header: {
          title: t('ImportToDrive.title', { smart_count: items.length }),
          subtitle: t('ImportToDrive.to')
        },
        footer: {
          confirmLabel: t('ImportToDrive.action'),
          cancelLabel: t('ImportToDrive.cancel')
        }
      }}
    />
  )
}

export { UploaderComponent }
