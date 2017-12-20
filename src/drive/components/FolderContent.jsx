import React from 'react'
import Spinner from 'cozy-ui/react/Spinner'
import Oops from 'components/Error/Oops'
import { EmptyDrive, EmptyTrash } from 'components/Error/Empty'
import FileList from './FileList'
import styles from '../styles/foldercontent'

const EmptyContent = props => {
  const { isTrashContext, canUpload } = props
  if (isTrashContext && !props.params.folderId) {
    return <EmptyTrash />
  }
  return <EmptyDrive canUpload={canUpload} />
}

const FolderContent = props => {
  const { fetchStatus, files, isAddingFolder } = props
  switch (fetchStatus) {
    case 'pending':
      return (
        <Spinner
          size="xxlarge"
          loadingType="message"
          middle="true"
          className={styles['content-spinner']}
        />
      )
    case 'failed':
      return <Oops />
    case 'loaded':
      return files.length === 0 && !isAddingFolder ? (
        <EmptyContent {...props} />
      ) : (
        <FileList withSelectionCheckbox {...props} />
      )
    default:
      return null
  }
}

export default FolderContent
