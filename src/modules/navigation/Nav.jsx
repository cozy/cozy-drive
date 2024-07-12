import React, { useState } from 'react'

import UINav from 'cozy-ui/transpiled/react/Nav'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { FavoriteItems } from 'modules/navigation/FavoriteItems'
import { NavItem } from 'modules/navigation/NavItem'
import { SharingsNavItem } from 'modules/navigation/SharingsNavItem'

export const Nav = () => {
  const clickState = useState(null)
  const { isDesktop } = useBreakpoints()

  return (
    <UINav>
      <NavItem
        to="/folder"
        icon="folder"
        label="drive"
        rx={/\/(folder|nextcloud|trash)(\/.*)?/}
        clickState={clickState}
      />
      {!isDesktop ? (
        <NavItem
          to="/favorites"
          icon="star"
          label="favorites"
          rx={/\/favorites(\/.*)?/}
          clickState={clickState}
        />
      ) : null}
      <NavItem
        to="/recent"
        icon="clock"
        label="recent"
        rx={/\/recent(\/.*)?/}
        clickState={clickState}
      />
      <SharingsNavItem clickState={clickState} />
      {isDesktop ? (
        <FavoriteItems clickState={clickState} className="u-mt-half" />
      ) : null}
    </UINav>
  )
}

export default Nav
