import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { TableBody } from 'cozy-ui/transpiled/react/Table'

import { FabContext } from 'drive/lib/FabProvider'
import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

import styles from 'drive/styles/filelist.styl'

const FileListBody = ({ className, children }) => {
  const selectionModeActive = useSelector(isSelectionBarVisible)
  const { isFabDisplayed } = useContext(FabContext)

  return (
    <TableBody
      data-test-id="fil-content-body"
      className={cx(className, styles['fil-content-body'], {
        [styles['fil-content-body--selectable']]: selectionModeActive,
        [styles['fil-content-body--withFabActive']]: isFabDisplayed
      })}
    >
      {children}
    </TableBody>
  )
}

export default FileListBody
