import React from 'react'

import { useQuery } from 'cozy-client'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FolderPicker } from 'components/FolderPicker/FolderPicker'
import {
  File,
  FolderPickerEntry,
  IOCozyFileWithExtra
} from 'components/FolderPicker/types'
import { ROOT_DIR_ID } from 'constants/config'
import { buildOnlyFolderQuery } from 'modules/queries'
import { shouldRender } from 'modules/views/Upload/UploadUtils'
import { useUploadFromFlagship } from 'modules/views/Upload/useUploadFromFlagship'

const UploaderComponent = (): JSX.Element | null => {
  const { t } = useI18n()
  const { items, uploadFilesFromFlagship, onClose, uploadInProgress } =
    useUploadFromFlagship()

  const handleConfirm = (folder?: File): void => {
    if (!folder?._id) {
      throw new Error('A folder id is required')
    }
    uploadFilesFromFlagship(folder._id)
  }

  const rootFolderQuery = buildOnlyFolderQuery(ROOT_DIR_ID)
  const rootFolderResult = useQuery(
    rootFolderQuery.definition,
    rootFolderQuery.options
  ) as {
    data?: IOCozyFileWithExtra
  }

  // If there are no items to render, we display a spinner with a full screen dialog to hide the UI behind
  if (!shouldRender(items) && !rootFolderResult.data) {
    return (
      <FixedDialog
        className="u-p-0"
        open
        size="large"
        content={<Spinner size="xxlarge" noMargin middle />}
      />
    )
  }

  const fakeFiles: FolderPickerEntry[] = (items ?? []).map(item => ({
    _type: 'io.cozy.files',
    type: 'file',
    dir_id: item.dirId,
    name: item.fileName,
    mime: item.mimeType
  }))

  return (
    <FolderPicker
      currentFolder={rootFolderResult.data}
      entries={fakeFiles}
      canCreateFolder={false}
      onConfirm={handleConfirm}
      onClose={onClose}
      isBusy={uploadInProgress}
      slotProps={{
        header: {
          title: t('ImportToDrive.title', { smart_count: fakeFiles.length }),
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
