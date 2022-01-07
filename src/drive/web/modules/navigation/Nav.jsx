/* global __TARGET__ */
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react'

import UINav, {
  NavItem,
  NavIcon,
  NavText,
  NavLink as UINavLink
} from 'cozy-ui/transpiled/react/Nav'

/**
 * Returns true if `to` and `pathname` match
 * Supports `rx` for regex matches.
 */
const navLinkMatch = (rx, to, pathname) => {
  return rx ? rx.test(pathname) : pathname.slice(1) === to
}

/**
 * Like react-router NavLink but sets the lastClicked state (passed in props)
 * to have a faster change of active (not waiting for the route to completely
 * change).
 */
export const NavLink = withRouter(props => {
  const {
    children,
    to,
    rx,
    location,
    clickState: [lastClicked, setLastClicked]
  } = props

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
})

const NavItems = ({ items }) => {
  const clickState = useState(null)
  return (
    <>
      {items.map((item, i) =>
        item ? (
          <NavItem key={i} secondary={item.secondary}>
            <NavLink to={item.to} rx={item.rx} clickState={clickState}>
              {item.icon ? <NavIcon icon={item.icon} /> : null}
              <NavText>{item.label}</NavText>
            </NavLink>
          </NavItem>
        ) : null
      )}
    </>
  )
}
const folderRoute = /\/folder(\/.*)?/
const settingsRoute = /\/settings(\/.*)?/
const recentRoute = /\/recent(\/.*)?/
const sharingRoute = /\/sharings(\/.*)?/
const trashRoute = /\/trash(\/.*)?/
export const Nav = () => {
  const { t } = useI18n()
  const routes = [
    {
      to: '/folder',
      icon: 'folder',
      label: t('Nav.item_drive'),
      rx: folderRoute
    },
    {
      to: '/recent',
      icon: 'clock',
      label: t('Nav.item_recent'),
      rx: recentRoute
    },
    {
      to: '/sharings',
      icon: 'share',
      label: t('Nav.item_sharings'),
      rx: sharingRoute
    },
    {
      to: '/trash',
      icon: 'trash',
      label: t('Nav.item_trash'),
      rx: trashRoute
    }
  ]
  if (__TARGET__ === 'mobile') {
    routes.push({
      to: '/settings',
      icon: 'gear',
      label: t('Nav.item_settings'),
      rx: settingsRoute
    })
  }
  return (
    <UINav>
      <NavItems items={routes} />
    </UINav>
  )
}

export default Nav
