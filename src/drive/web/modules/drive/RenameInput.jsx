import React from 'react'
import { connect } from 'react-redux'

import { useClient } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import useBrowserOffline from 'cozy-ui/transpiled/react/hooks/useBrowserOffline'

import { CozyFile } from 'models'
import FilenameInput from 'drive/web/modules/filelist/FilenameInput'
import { abortRenaming } from './rename'

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
            Alerter.error('alert.offline')
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
            Alerter.error('upload.alert.network')
          } else if (
            error.message.includes(
              'Invalid filename containing illegal character(s):'
            )
          ) {
            Alerter.error(
              'alert.file_name_illegal_characters',
              {
                fileName: newName,
                characters: error.message.split(
                  'Invalid filename containing illegal character(s): '
                )[1]
              },
              { duration: 2000 }
            )
          } else if (error.message.includes('Invalid filename:')) {
            Alerter.error('alert.file_name_illegal_name', { fileName: newName })
          } else if (error.message.includes('Missing name argument')) {
            Alerter.error('alert.file_name_missing')
          } else {
            Alerter.error('alert.file_name', { fileName: newName })
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
