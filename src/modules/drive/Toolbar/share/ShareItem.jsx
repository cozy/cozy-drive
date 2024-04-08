import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { SharedDocument } from 'cozy-sharing'
import { AvatarList } from 'cozy-sharing/dist/components/Avatar/AvatarList'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getPathToShareDisplayedFolder } from 'modules/drive/Toolbar/share/helpers'
import styles from 'styles/toolbar.styl'

const ShareItem = ({ displayedFolder }) => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const share = () => {
    navigate(getPathToShareDisplayedFolder(pathname))
  }

  return (
    <SharedDocument docId={displayedFolder.id}>
      {({ isSharedWithMe, recipients, link }) => (
        <ActionMenuItem
          onClick={share}
          left={<Icon icon={ShareIcon} />}
          right={
            <div className={styles['menu-recipients-wrapper']}>
              <AvatarList
                className={styles['menu-recipients']}
                recipients={recipients}
                link={link}
                size="small"
              />
            </div>
          }
        >
          {t(
            isSharedWithMe
              ? 'Files.share.sharedWithMe'
              : 'toolbar.menu_share_folder'
          )}
        </ActionMenuItem>
      )}
    </SharedDocument>
  )
}

export default ShareItem
