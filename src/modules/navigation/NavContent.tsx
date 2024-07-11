import React from 'react'

import Badge from 'cozy-ui/transpiled/react/Badge'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Icon from 'cozy-ui/transpiled/react/Icon'
import OpenWithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'
import { NavIcon, NavText } from 'cozy-ui/transpiled/react/Nav'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

interface NavContentProps {
  icon?: string
  badgeContent?: number
  label?: string
  isExternal?: boolean
}

const NavContent: React.FC<NavContentProps> = ({
  icon,
  badgeContent,
  label,
  isExternal
}) => {
  const { isDesktop } = useBreakpoints()

  if (badgeContent) {
    if (isDesktop) {
      return (
        <>
          {icon && <NavIcon icon={icon} />}
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
          {icon && (
            <Badge badgeContent={badgeContent} color="error" withBorder={false}>
              <NavIcon icon={icon} />
            </Badge>
          )}
          <NavText>{label}</NavText>
        </>
      )
    }
  }

  // Used for shared drives (eg. NextCloud)
  if (isExternal) {
    return (
      <>
        <Typography variant="inherit" color="inherit" noWrap>
          {label}
        </Typography>
        <Icon
          icon={OpenWithIcon}
          size={11}
          style={{ marginLeft: '4px', flexShrink: '0' }}
        />
      </>
    )
  }

  return (
    <>
      {icon && <NavIcon icon={icon} />}
      <NavText>{label}</NavText>
    </>
  )
}

export { NavContent }
