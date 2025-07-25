import React, { FC } from 'react'

import FileTypeServerIcon from 'cozy-ui/transpiled/react/Icons/FileTypeServer'
import { NavIcon, NavLink, NavItem } from 'cozy-ui/transpiled/react/Nav'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { FileLink } from '@/modules/navigation/components/FileLink'
import { useSharedDriveLink } from '@/modules/navigation/hooks/useSharedDriveLink'
import { SharedDrive } from '@/modules/shareddrives/helpers'

interface SharedDriveListItemProps {
  sharedDrive: SharedDrive
  clickState: [string, (value: string | undefined) => void]
}

const SharedDriveListItem: FC<SharedDriveListItemProps> = ({
  sharedDrive,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clickState: [lastClicked, setLastClicked]
}) => {
  const { link } = useSharedDriveLink(sharedDrive)

  return (
    <NavItem key={sharedDrive._id}>
      <FileLink
        link={link}
        className={NavLink.className}
        onClick={(): void => setLastClicked(undefined)}
      >
        <NavIcon icon={FileTypeServerIcon} />
        <Typography variant="inherit" color="inherit" noWrap>
          {sharedDrive.rules[0].title}
        </Typography>
      </FileLink>
    </NavItem>
  )
}

export { SharedDriveListItem }
