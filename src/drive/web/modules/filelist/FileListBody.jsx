import React, { useContext } from 'react'
import cx from 'classnames'

import { TableBody } from 'cozy-ui/transpiled/react/Table'

import { FabContext } from 'drive/lib/FabProvider'
import { useSelectionContext } from 'drive/web/modules/selection/SelectionProvider'

import styles from 'drive/styles/filelist.styl'

const FileListBody = ({ className, children }) => {
  const { isSelectionBarVisible } = useSelectionContext()
  const { isFabDisplayed } = useContext(FabContext)

  return (
    <TableBody
      data-testid="fil-content-body"
      className={cx(className, styles['fil-content-body'], {
        [styles['fil-content-body--selectable']]: isSelectionBarVisible,
        [styles['fil-content-body--withFabActive']]: isFabDisplayed
      })}
    >
      {children}
    </TableBody>
  )
}

export default FileListBody
