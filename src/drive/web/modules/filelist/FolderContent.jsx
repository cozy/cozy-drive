import React from 'react'
import PropTypes from 'prop-types'
import Oops from 'components/Error/Oops'
import { EmptyDrive, EmptyTrash } from 'components/Error/Empty'
import FileListPlaceholder from './FileListPlaceholder'
import FileList from './FileList'

const EmptyContent = props => {
  const { isTrashContext, canUpload } = props
  if (isTrashContext && !props.params.folderId) {
    return <EmptyTrash />
  }
  return <EmptyDrive canUpload={canUpload} />
}

EmptyContent.propTypes = {
  isTrashContext: PropTypes.bool,
  canUpload: PropTypes.bool,
  params: PropTypes.object
}

EmptyContent.defaultProps = {
  isTrashContext: false,
  canUpload: false,
  params: {}
}

const FolderContent = props => {
  const { files, isAddingFolder, isLoading, isInError } = props

  if (isLoading) return <FileListPlaceholder />
  else if (isInError) return <Oops />
  else if (files.length === 0 && !isAddingFolder)
    return <EmptyContent {...props} />
  else return <FileList withSelectionCheckbox {...props} />
}

FolderContent.propTypes = {
  files: PropTypes.array,
  isAddingFolder: PropTypes.bool,
  isLoading: PropTypes.bool,
  isInError: PropTypes.bool
}

FolderContent.defaultProps = {
  files: [],
  isAddingFolder: false,
  isLoading: false,
  isInError: false
}

export default FolderContent
