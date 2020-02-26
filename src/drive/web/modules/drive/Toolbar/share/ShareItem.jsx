import React from 'react'
import { RecipientsAvatars } from 'cozy-sharing/dist/components/Recipient'
import { translate } from 'cozy-ui/transpiled/react'
import styles from 'drive/styles/toolbar.styl'
import { SharedDocument } from 'cozy-sharing'
import shareContainer from './share'

const ShareItem = translate()(({ t, share, displayedFolder }) => {
  return (
    <SharedDocument docId={displayedFolder.id}>
      {({ isSharedWithMe, recipients, link }) => (
        <a
          className={styles['fil-action-share']}
          onClick={() => share(displayedFolder)}
        >
          {t(
            isSharedWithMe
              ? 'Files.share.sharedWithMe'
              : 'toolbar.menu_share_folder'
          )}
          <RecipientsAvatars
            className={styles['fil-toolbar-menu-recipients']}
            recipients={recipients}
            link={link}
            size="small"
          />
        </a>
      )}
    </SharedDocument>
  )
})

export default shareContainer(ShareItem)
