import React from 'react'
import PropTypes from 'prop-types'
import { SharedDocument, SharedRecipients } from 'cozy-sharing'
import MenuItem from 'drive/web/modules/actionmenu/MenuItem'
import styles from 'drive/styles/actionmenu.styl'

const ShareMenuItem = ({ docId, ...rest }, { t }) => (
  <SharedDocument docId={docId}>
    {({ isSharedWithMe }) => (
      <MenuItem {...rest}>
        {isSharedWithMe ? t('Files.share.sharedWithMe') : t('Files.share.cta')}
        <SharedRecipients
          className={styles['fil-actionmenu-recipients']}
          docId={docId}
          size="small"
        />
      </MenuItem>
    )}
  </SharedDocument>
)

ShareMenuItem.contextTypes = {
  t: PropTypes.func.isRequired
}

export default ShareMenuItem
