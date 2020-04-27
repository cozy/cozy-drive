import React from 'react'
import { RecipientsAvatars } from 'cozy-sharing/dist/components/Recipient'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import styles from 'drive/styles/toolbar.styl'
import { SharedDocument } from 'cozy-sharing'
import shareContainer from './share'

const ShareItem = translate()(({ t, share, displayedFolder }) => {
  return (
    <SharedDocument docId={displayedFolder.id}>
      {({ isSharedWithMe, recipients, link }) => (
        <ActionMenuItem
          onClick={() => share(displayedFolder)}
          left={<Icon icon="share" />}
          right={
            <div className={styles['menu-recipients-wrapper']}>
              <RecipientsAvatars
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
})

export default shareContainer(ShareItem)
