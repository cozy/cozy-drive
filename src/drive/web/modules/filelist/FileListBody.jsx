import React from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { TableBody } from 'cozy-ui/transpiled/react/Table'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

import styles from 'drive/styles/filelist.styl'

const FileListBody = ({ className, children }) => {
  const selectionModeActive = useSelector(isSelectionBarVisible)

  return (
    <TableBody
      data-test-id="fil-content-body"
      className={cx(className, styles['fil-content-body'], {
        [styles['fil-content-body--selectable']]: selectionModeActive
      })}
    >
      {children}
    </TableBody>
  )
}

export default FileListBody
