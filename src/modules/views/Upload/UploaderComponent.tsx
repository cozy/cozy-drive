import React from 'react'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FolderPicker } from 'components/FolderPicker/FolderPicker'
import { shouldRender } from 'modules/views/Upload/UploadUtils'
import { useUploadFromFlagship } from 'modules/views/Upload/useUploadFromFlagship'

const UploaderComponent = (): JSX.Element | null => {
  const { t } = useI18n()
  const { items, uploadFilesFromFlagship, onClose, uploadInProgress } =
    useUploadFromFlagship()

  const handleConfirm = (folderId: string): void => {
    uploadFilesFromFlagship(folderId)
  }

  // If there are no items to render, we display a spinner with a full screen dialog to hide the UI behind
  if (!shouldRender(items)) {
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
