import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'
import Oops from 'components/Error/Oops'
import { EmptyDrive, EmptyTrash } from 'components/Error/Empty'
import AsyncBoundary from 'drive/web/modules/navigation/AsyncBoundary'
import FileListRowsPlaceholder from './FileListRowsPlaceholder'
import FileListRows from './FileListRows'
import AddFolder from './AddFolder'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import { isTypingNewFolderName } from './duck'

import styles from 'drive/styles/filelist'

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

export class FileListBody extends Component {
  disablePointerEvents = () => {
    if (this.bodyRef)
      this.bodyRef.classList.add(styles['fil-content-body--menu-visible'])
  }

  enablePointerEvents = () => {
    if (this.bodyRef)
      this.bodyRef.classList.remove(styles['fil-content-body--menu-visible'])
  }

  render() {
    const { files, selectionModeActive, isTypingNewFolderName } = this.props
    return (
      <div
        ref={el => (this.bodyRef = ReactDOM.findDOMNode(el))}
        className={cx(styles['fil-content-body'], {
          [styles['fil-content-body--selectable']]: selectionModeActive
        })}
      >
        <AddFolder />
        <AsyncBoundary>
          {({ isLoading, isInError }) => {
            if (isLoading) return <FileListRowsPlaceholder />
            else if (isInError) return <Oops />
            else if (files.length === 0 && !isTypingNewFolderName)
              return <EmptyContent {...this.props} />
            else
              return (
                <FileListRows
                  onActionMenuShow={this.disablePointerEvents}
                  onActionMenuHide={this.enablePointerEvents}
                  withSelectionCheckbox
                  {...this.props}
                />
              )
          }}
        </AsyncBoundary>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  selectionModeActive: isSelectionBarVisible(state),
  isTypingNewFolderName: isTypingNewFolderName(state)
})

export default connect(mapStateToProps)(FileListBody)
