import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

import styles from 'drive/styles/filelist.styl'

export const FileListBody = ({ children, selectionModeActive }) => (
  <div
    data-test-id="fil-content-body"
    className={cx(styles['fil-content-body'], {
      [styles['fil-content-body--selectable']]: selectionModeActive
    })}
  >
    {children}
  </div>
)

FileListBody.propTypes = {
  selectionModeActive: PropTypes.bool
}

const mapStateToProps = state => ({
  selectionModeActive: isSelectionBarVisible(state)
})

export const ConnectedFileListBody = connect(mapStateToProps)(FileListBody)
