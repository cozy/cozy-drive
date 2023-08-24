import React from 'react'
import cx from 'classnames'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { NavLink as UINavLink } from 'cozy-ui/transpiled/react/Nav'

import { navLinkMatch } from 'drive/web/modules/navigation/helpers'

/**
 * Like react-router NavLink but sets the lastClicked state (passed in props)
 * to have a faster change of active (not waiting for the route to completely
 * change).
 */
const NavLink = ({
  children,
  to,
  rx,
  clickState: [lastClicked, setLastClicked]
}) => {
  const location = useLocation()
  const pathname = lastClicked ? lastClicked : location.pathname
  const isActive = navLinkMatch(rx, to, pathname)
  return (
    <a
      style={{ outline: 'none' }}
      onClick={() => setLastClicked(to)}
      href={`#${to}`}
      className={cx(
        UINavLink.className,
        isActive ? UINavLink.activeClassName : null
      )}
    >
      {children}
    </a>
  )
}

NavLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  rx: PropTypes.shape(RegExp)
}

export { NavLink }
