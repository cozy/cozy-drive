import React, { useState } from 'react'

import flag from 'cozy-flags'
import UINav from 'cozy-ui/transpiled/react/Nav'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { FavoriteList } from 'modules/navigation/FavoriteList'
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
      {!isDesktop && flag('drive.show-favorites-dev') ? (
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
      {isDesktop && flag('drive.show-favorites-dev') ? (
        <FavoriteList clickState={clickState} className="u-mt-half" />
      ) : null}
    </UINav>
  )
}

export default Nav
