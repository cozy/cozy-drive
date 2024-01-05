import React from 'react'
import PropTypes from 'prop-types'

import { NavItem as UINavItem } from 'cozy-ui/transpiled/react/Nav'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { NavContent } from 'modules/navigation/NavContent'
import { NavLink } from 'modules/navigation/NavLink'

const NavItem = ({ to, icon, label, rx, clickState, badgeContent }) => {
  const { t } = useI18n()

  return (
    <UINavItem>
      <NavLink to={to} rx={rx} clickState={clickState}>
        <NavContent
          icon={icon}
          label={t(`Nav.item_${label}`)}
          badgeContent={badgeContent}
        />
      </NavLink>
    </UINavItem>
  )
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rx: PropTypes.shape(RegExp),
  badgeContent: PropTypes.number
}

export { NavItem }
