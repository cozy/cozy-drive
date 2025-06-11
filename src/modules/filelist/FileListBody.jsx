import cx from 'classnames'
import React, { forwardRef, useContext, useRef } from 'react'

import { TableBody } from 'cozy-ui/transpiled/react/deprecated/Table'

import styles from '@/styles/filelist.styl'

import { FabContext } from '@/lib/FabProvider'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'

/**
 * Renders the body of the file list.
 *
 * @component
 * @param {Object} [props] - The component props.
 * @param {string} [props.className] - The CSS class name for the component.
 * @param {ReactNode} props.children - The child elements to be rendered inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const FileListBody = forwardRef(({ className, children }, ref) => {
  const { isSelectionBarVisible } = useSelectionContext()
  const { isFabDisplayed } = useContext(FabContext)

  return (
    <TableBody
      ref={ref}
      data-testid="fil-content-body"
      className={cx(className, styles['fil-content-body'], {
        [styles['fil-content-body--selectable']]: isSelectionBarVisible,
        [styles['fil-content-body--withFabActive']]: isFabDisplayed
      })}
    >
      {children}
    </TableBody>
  )
})

FileListBody.displayName = 'FileListBody'

export default FileListBody
