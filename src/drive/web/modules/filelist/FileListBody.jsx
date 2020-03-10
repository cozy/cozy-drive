import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'
import get from 'lodash/get'

import { useClient, useCapabilities } from 'cozy-client'

import Oops from 'components/Error/Oops'
import { EmptyDrive, EmptyTrash } from 'components/Error/Empty'
import AsyncBoundary from 'drive/web/modules/navigation/AsyncBoundary'
import FileListRowsPlaceholder from 'drive/web/modules/filelist/FileListRowsPlaceholder'
import FileListRows from 'drive/web/modules/filelist/FileListRows'
import AddFolder from 'drive/web/modules/filelist/AddFolder'
import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import { isTypingNewFolderName } from 'drive/web/modules/filelist/duck'

import styles from 'drive/styles/filelist.styl'

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

export const FileListBodyV2 = ({ children, selectionModeActive }) => (
  <div
    data-test-id="fil-content-body"
    className={cx(styles['fil-content-body'], {
      [styles['fil-content-body--selectable']]: selectionModeActive
    })}
  >
    {children}
  </div>
)

export const FileListBody = ({
  files,
  selectionModeActive,
  isTypingNewFolderName,
  withSelectionCheckbox,
  ...props
}) => {
  const client = useClient()
  const capabilities = useCapabilities(client)
  const isFlatDomain = get(
    capabilities,
    'capabilities.data.attributes.flat_subdomains'
  )
  return (
    <FileListBodyV2 selectionModeActive={selectionModeActive}>
      <AddFolder />
      <AsyncBoundary>
        {({ isLoading, isInError }) => {
          if (isLoading) return <FileListRowsPlaceholder />
          else if (isInError) return <Oops />
          else if (files.length === 0 && !isTypingNewFolderName)
            return <EmptyContent {...props} />
          else
            return (
              <FileListRows
                files={files}
                withSelectionCheckbox={withSelectionCheckbox}
                isFlatDomain={isFlatDomain}
                {...props}
              />
            )
        }}
      </AsyncBoundary>
    </FileListBodyV2>
  )
}

FileListBody.propTypes = {
  selectionModeActive: PropTypes.bool,
  isTypingNewFolderName: PropTypes.bool,
  withSelectionCheckbox: PropTypes.bool,
  files: PropTypes.array,
  fileCount: PropTypes.number,
  fetchMoreFiles: PropTypes.func,
  displayedFolder: PropTypes.object,
  fileActions: PropTypes.object,
  onFolderOpen: PropTypes.func,
  onFileOpen: PropTypes.func,
  withFilePath: PropTypes.bool,
  withSharedBadge: PropTypes.bool,
  isRenaming: PropTypes.bool,
  renamingFile: PropTypes.object
}

const mapStateToProps = state => ({
  selectionModeActive: isSelectionBarVisible(state),
  isTypingNewFolderName: isTypingNewFolderName(state)
})

export default connect(mapStateToProps)(FileListBody)
