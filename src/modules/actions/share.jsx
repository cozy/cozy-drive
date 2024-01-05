import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import { SharedRecipients } from 'cozy-sharing'

import { isEncryptedFileOrFolder } from 'lib/encryption'
import { navigateToModal } from 'modules/actions/helpers'

const share = ({ hasWriteAccess, navigate, pathname }) => {
  return {
    name: 'share',
    icon: 'share',
    displayCondition: files =>
      hasWriteAccess &&
      files.length === 1 &&
      !isEncryptedFileOrFolder(files[0]),
    action: files =>
      navigateToModal({ navigate, pathname, files, path: 'share' }),
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
            <ListItemIcon classes={{ root: 'u-w-auto' }}>
              <SharedRecipients docId={props.doc.id} size="small" />
            </ListItemIcon>
          ) : null}
        </ActionsMenuItem>
      )
    })
  }
}

export { share }
