import React, { useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { File, FolderPickerEntry } from 'components/FolderPicker/types'
import { cancelMove } from 'modules/move/helpers'
import { useCancelable } from 'modules/move/hooks/useCancelable'

interface MoveModalSuccessActionProps {
  folder: File
  entries: FolderPickerEntry[]
  trashedFiles: File[]
  canCancel?: boolean
  refreshSharing: () => void
  navigate: NavigateFunction
}

const MoveModalSuccessAction: React.FC<MoveModalSuccessActionProps> = ({
  folder,
  entries,
  trashedFiles,
  canCancel = true,
  refreshSharing,
  navigate
}) => {
  const { t } = useI18n()
  const client = useClient()
  const { registerCancelable } = useCancelable()
  const [isCancelling, setCancelling] = useState(false)

  const handleCancel = async (): Promise<void> => {
    setCancelling(true)
    await cancelMove({
      entries,
      trashedFiles,
      client,
      registerCancelable,
      refreshSharing
    })
  }

  const handleNavigateFolder = (): void => {
    if (folder._type === 'io.cozy.remote.nextcloud.files') {
      return navigate(
        `/nextcloud/${folder.cozyMetadata.sourceAccount}?path=${folder.path}`
      )
    }

    return navigate(`/folder/${folder._id}`)
  }

  return (
    <>
      {canCancel ? (
        <Button
          color="success"
          label={t('Move.cancel')}
          onClick={handleCancel}
          size="small"
          variant="text"
          disabled={isCancelling}
        />
      ) : null}
      <Button
        color="success"
        label={t('Move.go_to_dir')}
        onClick={handleNavigateFolder}
        size="small"
        variant="text"
      />
    </>
  )
}

export { MoveModalSuccessAction }
