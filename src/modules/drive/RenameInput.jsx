import React from 'react'
import { connect } from 'react-redux'

import { useClient } from 'cozy-client'
import useBrowserOffline from 'cozy-ui/transpiled/react/hooks/useBrowserOffline'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { abortRenaming } from './rename'

import { CozyFile } from '@/models'
import FilenameInput from '@/modules/filelist/FilenameInput'

// If we set the _rev then CozyClient tries to update. Else
// it tries to create
const updateFileNameQuery = async (client, file, newName) => {
  return client.save({
    ...file,
    name: newName,
    _rev: file._rev || file.meta.rev
  })
}

export const RenameInput = ({
  onAbort,
  file,
  refreshFolderContent,
  className,
  withoutExtension
}) => {
  const client = useClient()
  const { showAlert } = useAlert()
  const { t } = useI18n()

  const { filename, extension } = CozyFile.splitFilename(file)
  const name = withoutExtension ? filename : file.name
  const isOffline = useBrowserOffline()

  return (
    <FilenameInput
      className={className}
      name={name}
      file={file}
      onSubmit={async newValue => {
        const newName = withoutExtension ? newValue + extension : newValue
        try {
          if (isOffline) {
            showAlert({ message: t('alert.offline'), severity: 'error' })
          } else {
            await updateFileNameQuery(client, file, newName)
            if (refreshFolderContent) refreshFolderContent()
          }
        } catch (error) {
          if (
            error.message.includes(
              'NetworkError when attempting to fetch resource.'
            )
          ) {
            showAlert({ message: t('upload.alert.network'), severity: 'error' })
          } else if (
            error.message.includes(
              'Invalid filename containing illegal character(s):'
            )
          ) {
            showAlert({
              message: t('alert.file_name_illegal_characters', {
                fileName: newName,
                characters: error.message.split(
                  'Invalid filename containing illegal character(s): '
                )[1]
              }),
              severity: 'error',
              duration: 2000
            })
          } else if (error.message.includes('Invalid filename:')) {
            showAlert({
              message: t('alert.file_name_illegal_name', { fileName: newName }),
              severity: 'error'
            })
          } else if (error.message.includes('Missing name argument')) {
            showAlert({
              message: t('alert.file_name_missing'),
              severity: 'error'
            })
          } else {
            showAlert({
              message: t('alert.file_name', { fileName: newName }),
              severity: 'error'
            })
          }
        } finally {
          onAbort()
        }
      }}
      onAbort={onAbort}
    />
  )
}

const mapDispatchToProps = dispatch => ({
  onAbort: () => dispatch(abortRenaming())
})

export default connect(null, mapDispatchToProps)(RenameInput)
