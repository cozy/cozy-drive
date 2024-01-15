import PropTypes from 'prop-types'
import React from 'react'

import Badge from 'cozy-ui/transpiled/react/Badge'
import Circle from 'cozy-ui/transpiled/react/Circle'
import { NavIcon, NavText } from 'cozy-ui/transpiled/react/Nav'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const NavContent = ({ icon, badgeContent, label }) => {
  const { isDesktop } = useBreakpoints()

  if (badgeContent) {
    if (isDesktop) {
      return (
        <>
          <NavIcon icon={icon} />
          <NavText>{label}</NavText>
          <Circle
            size="xsmall"
            className="u-ml-auto u-mr-1"
            backgroundColor="var(--errorColor)"
          >
            <span style={{ fontSize: '11px', lineHeight: '1rem' }}>
              {badgeContent > 99 ? '99+' : badgeContent}
            </span>
          </Circle>
        </>
      )
    } else {
      return (
        <>
          <Badge badgeContent={badgeContent} color="error" withBorder={false}>
            <NavIcon icon={icon} />
          </Badge>
          <NavText>{label}</NavText>
        </>
      )
    }
  }

  return (
    <>
      <NavIcon icon={icon} />
      <NavText>{label}</NavText>
    </>
  )
}

NavContent.propTypes = {
  icon: PropTypes.string,
  badgeContent: PropTypes.number,
  label: PropTypes.string
}

export { NavContent }
