/* global __TARGET__ */
import React, { useState } from 'react'

import UINav from 'cozy-ui/transpiled/react/Nav'

import { NavItem } from 'drive/web/modules/navigation/NavItem'

export const Nav = () => {
  const clickState = useState(null)

  return (
    <UINav>
      <NavItem
        to="/folder"
        icon="folder"
        label="drive"
        rx={/\/folder(\/.*)?/}
        clickState={clickState}
      />
      <NavItem
        to="/recent"
        icon="clock"
        label="recent"
        rx={/\/recent(\/.*)?/}
        clickState={clickState}
      />
      <NavItem
        to="/sharings"
        icon="share"
        label="sharings"
        rx={/\/sharings(\/.*)?/}
        clickState={clickState}
      />
      <NavItem
        to="/trash"
        icon="trash"
        label="trash"
        rx={/\/trash(\/.*)?/}
        clickState={clickState}
      />
      {__TARGET__ === 'mobile' ? (
        <NavItem
          to="/settings"
          icon="gear"
          label="settings"
          rx={/\/settings(\/.*)?/}
          clickState={clickState}
        />
      ) : null}
    </UINav>
  )
}

export default Nav
