import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

import styles from 'drive/styles/filelist.styl'

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

FileListBodyV2.propTypes = {
  selectionModeActive: PropTypes.bool
}

const mapStateToProps = state => ({
  selectionModeActive: isSelectionBarVisible(state)
})

export const ConnectedFileListBodyV2 = connect(mapStateToProps)(FileListBodyV2)
