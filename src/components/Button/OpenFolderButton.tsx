import React, { FC } from 'react'
import { NavigateFunction } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { File } from 'components/FolderPicker/types'

interface OpenFolderButtonProps {
  folder: File
  navigate: NavigateFunction
}

const OpenFolderButton: FC<OpenFolderButtonProps> = ({ folder, navigate }) => {
  const { t } = useI18n()

  const handleNavigateFolder = (): void => {
    if (folder._type === 'io.cozy.remote.nextcloud.files') {
      return navigate(
        `/nextcloud/${folder.cozyMetadata.sourceAccount}?path=${folder.path}`
      )
    }

    return navigate(`/folder/${folder._id}`)
  }

  return (
    <Button
      color="success"
      label={t('OpenFolderButton.label')}
      onClick={handleNavigateFolder}
      size="small"
      variant="text"
      style={{ color: `var(--successContrastTextColor)` }}
    />
  )
}

export { OpenFolderButton }
