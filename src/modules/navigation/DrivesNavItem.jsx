import React from 'react'

import { useQuery } from 'cozy-client'
import flag from 'cozy-flags'
import { NavDesktopLimiter } from 'cozy-ui/transpiled/react/Nav'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ROOT_DIR_ID } from 'constants/config'
import { CozyFile } from 'models/index'
import { NavItem } from 'modules/navigation/NavItem'
import { buildSharedDrivesQuery } from 'modules/views/Folder/queries/fetchSharedDrives'

const DrivesNavItem = ({ clickState }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  const sharedDrivesQuery = buildSharedDrivesQuery()
  const { data } = useQuery(
    sharedDrivesQuery.definition,
    sharedDrivesQuery.options
  )

  const hasMultipleDrive = data?.length > 0
  const showNextcloud = flag('drive.show-nextcloud-dev') == true

  return (
    <>
      <NavItem
        to="/folder"
        icon="folder"
        label={hasMultipleDrive ? 'drives' : 'drive'}
        rx={/\/(folder|nextcloud)(\/.*)?/}
        clickState={clickState}
      />
      {!isMobile && hasMultipleDrive ? (
        <NavDesktopLimiter
          className="u-p-0"
          showMoreString={t('Nav.view_more')}
          showLessString={t('Nav.view_less')}
        >
          <NavItem
            secondary
            forcedLabel={t('Nav.item_my_drive')}
            clickState={clickState}
            to={`/folder/${ROOT_DIR_ID}`}
            rx={/\/folder(\/.*)?/}
          />
          {data.map(file => {
            const filename = CozyFile.splitFilename(file).filename
            if (
              file.cozyMetadata?.createdByApp === 'nextcloud' &&
              showNextcloud
            ) {
              return (
                <NavItem
                  key={file._id}
                  secondary
                  forcedLabel={filename}
                  clickState={clickState}
                  to={`/nextcloud/${file._id}`}
                  rx={/\/nextcloud(\/.*)?/}
                />
              )
            }

            return (
              <NavItem
                key={file._id}
                secondary
                forcedLabel={filename}
                clickState={[null, () => {}]} // This avoid to select this nav item when after clicking to open an external page
                isExternal
                to={`/external/${file._id}`}
                rx={/\/external(\/.*)?/}
              />
            )
          })}
        </NavDesktopLimiter>
      ) : null}
    </>
  )
}

export { DrivesNavItem }
