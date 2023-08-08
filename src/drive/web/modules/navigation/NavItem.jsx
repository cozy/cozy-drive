import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react'

import {
  NavItem as UINavItem,
  NavIcon,
  NavText
} from 'cozy-ui/transpiled/react/Nav'

import { NavLink } from 'drive/web/modules/navigation/NavLink'

const NavItem = ({ to, icon, label, rx, clickState }) => {
  const { t } = useI18n()

  return (
    <UINavItem>
      <NavLink to={to} rx={rx} clickState={clickState}>
        <NavIcon icon={icon} />
        <NavText>{t(`Nav.item_${label}`)}</NavText>
      </NavLink>
    </UINavItem>
  )
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rx: PropTypes.shape(RegExp)
}

export { NavItem }
