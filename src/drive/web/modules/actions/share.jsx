import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import { ShareModal, SharedRecipients } from 'cozy-sharing'

import { isEncryptedFileOrFolder } from 'drive/lib/encryption'
import styles from 'drive/styles/actionmenu.styl'

const share = ({ hasWriteAccess, pushModal, popModal }) => {
  return {
    name: 'share',
    icon: 'share',
    displayCondition: files =>
      hasWriteAccess &&
      files.length === 1 &&
      !isEncryptedFileOrFolder(files[0]),
    action: files => {
      const document = Array.isArray(files) ? files[0] : files
      pushModal(
        <ShareModal
          document={document}
          documentType="Files"
          sharingDesc={document.name}
          onClose={popModal}
        />
      )
    },
    Component: forwardRef(function ShareMenuItemInMenu(props, ref) {
      const { t } = useI18n()
      const { isMobile } = useBreakpoints()

      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={ShareIcon} />
          </ListItemIcon>
          <ListItemText primary={t('Files.share.cta')} />
          {isMobile && props.doc ? (
            <ListItemIcon>
              <SharedRecipients
                className={styles['fil-actionmenu-recipients']}
                docId={props.doc.id}
                size="small"
              />
            </ListItemIcon>
          ) : null}
        </ActionsMenuItem>
      )
    })
  }
}

export { share }
