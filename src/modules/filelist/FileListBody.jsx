import cx from 'classnames'
import React, { useContext } from 'react'

import { TableBody } from 'cozy-ui/transpiled/react/deprecated/Table'

import { FabContext } from 'lib/FabProvider'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

import styles from 'styles/filelist.styl'

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
