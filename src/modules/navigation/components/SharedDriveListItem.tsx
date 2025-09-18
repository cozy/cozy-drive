import cx from 'classnames'
import React, { FC, useState } from 'react'

import FileTypeServerIcon from 'cozy-ui/transpiled/react/Icons/FileTypeServer'
import { NavIcon, NavLink, NavItem } from 'cozy-ui/transpiled/react/Nav'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { FileLink } from '@/modules/navigation/components/FileLink'
import { useSharedDriveLink } from '@/modules/navigation/hooks/useSharedDriveLink'
import { SharedDriveListItemMenu } from '@/modules/shareddrives/components/SharedDriveListItemMenu'
import { SharedDrive } from '@/modules/shareddrives/helpers'

// We need to override the NavItem styles to make the menu icon appear on the
// right side of the item.
const useStyles = makeStyles({
  withMenu: {
    flex: 0,
    width: 'calc(100% - 6.5rem)'
  }
})

interface SharedDriveListItemProps {
  sharedDrive: SharedDrive
  clickState: [string, (value: string | undefined) => void]
}

const SharedDriveListItem: FC<SharedDriveListItemProps> = ({
  sharedDrive,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clickState: [lastClicked, setLastClicked]
}) => {
  const classes = useStyles()

  const { link } = useSharedDriveLink(sharedDrive)
  const [isMenuAvailable, setIsMenuAvailable] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen)

  return (
    <NavItem
      key={sharedDrive._id}
      className="u-flex"
      onMouseOver={(): void => setIsMenuAvailable(true)}
      onMouseLeave={(): void => setIsMenuAvailable(false)}
    >
      <FileLink
        link={link}
        className={cx(NavLink.className, isMenuAvailable && classes.withMenu)}
        onClick={(): void => setLastClicked(undefined)}
      >
        <NavIcon icon={FileTypeServerIcon} />
        <Typography variant="inherit" color="inherit" noWrap>
          {sharedDrive.description}
        </Typography>
      </FileLink>
      {isMenuAvailable && (
        <SharedDriveListItemMenu
          isOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          sharedDrive={sharedDrive}
        />
      )}
    </NavItem>
  )
}

export { SharedDriveListItem }
