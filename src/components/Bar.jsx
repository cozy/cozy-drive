import React from 'react'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import cx from 'classnames'
import cozyBar from 'lib/cozyBar'

const wrap = (Component, className) => {
  const WrappedBarComponent = ({ children }) => {
    return (
      <Component>
        <CozyTheme
          className={cx('u-flex u-flex-items-center', className)}
          variant="normal"
        >
          {children}
        </CozyTheme>
      </Component>
    )
  }
  return WrappedBarComponent
}

export const BarCenter = wrap(cozyBar.BarCenter, 'u-ellipsis')
export const BarRight = wrap(cozyBar.BarRight)
export const BarLeft = wrap(cozyBar.BarLeft)
export const BarSearch = wrap(cozyBar.BarSearch, 'u-flex-grow')
