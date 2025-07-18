import cx from 'classnames'
import React, { forwardRef } from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import styles from '@/styles/folder-view.styl'

const GridWrapper = forwardRef(({ style, children }, ref) => {
  const { isDesktop } = useBreakpoints()

  return (
    <div
      ref={ref}
      className={cx(
        styles['fil-folder-body-grid'],
        !isDesktop ? 'u-ov-hidden' : ''
      )}
      style={style}
    >
      {children}
    </div>
  )
})

GridWrapper.displayName = 'GridWrapper'

export default GridWrapper
