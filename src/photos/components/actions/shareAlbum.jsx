import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ActionMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { SharedDocument } from 'cozy-sharing'
import RecipientsAvatars from 'cozy-sharing/dist/components/Recipient/RecipientsAvatars'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'

const shareAlbum = (onShare, album) => () => ({
  name: 'shareAlbum',
  action: () => onShare(album),
  Component: forwardRef(function NewAlbum(props, ref) {
    const { t } = useI18n()
    return (
      <ActionMenuItem {...props} ref={ref}>
        <SharedDocument docId={album.id}>
          {({ isSharedWithMe, recipients, link }) => (
            <>
              <ListItemIcon>
                <Icon icon={ShareIcon} />
              </ListItemIcon>
              <ListItemText
                primary={t(
                  isSharedWithMe
                    ? 'Albums.share.sharedWithMe'
                    : 'Albums.share.cta'
                )}
              />
              <ListItemIcon>
                <RecipientsAvatars
                  recipients={recipients}
                  link={link}
                  size="small"
                />
              </ListItemIcon>
            </>
          )}
        </SharedDocument>
      </ActionMenuItem>
    )
  })
})

export default shareAlbum
