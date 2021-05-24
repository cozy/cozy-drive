import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { TableBody } from 'cozy-ui/transpiled/react/Table'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

import styles from 'drive/styles/filelist.styl'

const FileListBody = ({ className, children, isFabActive }) => {
  const selectionModeActive = useSelector(isSelectionBarVisible)

  return (
    <TableBody
      data-test-id="fil-content-body"
      className={cx(className, styles['fil-content-body'], {
        [styles['fil-content-body--selectable']]: selectionModeActive,
        [styles['fil-content-body--withFabActive']]: isFabActive
      })}
    >
      {children}
    </TableBody>
  )
}

FileListBody.propTypes = {
  isFabActive: PropTypes.bool
}

export default FileListBody
