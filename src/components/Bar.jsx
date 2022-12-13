import React from 'react'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import cx from 'classnames'
import cozyBar from 'lib/cozyBar'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const wrap = (Component, className) => {
  const WrappedBarComponent = ({ children }) => {
    const { isMobile } = useBreakpoints()
    return (
      <Component>
        <CozyTheme
          className={cx('u-flex u-flex-items-center', className)}
          variant={isMobile ? 'inverted' : 'normal'}
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
