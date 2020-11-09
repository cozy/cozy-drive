import React from 'react'
import PropTypes from 'prop-types'
import { SharedDocument, SharedRecipients } from 'cozy-sharing'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import styles from 'drive/styles/actionmenu.styl'

const ShareMenuItem = ({ docId, onClick }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  return (
    <SharedDocument docId={docId}>
      {({ isShared, isSharedWithMe }) => (
        <ActionMenuItem
          className={'u-flex-items-center u-pos-relative'}
          onClick={onClick}
          left={<Icon icon="share" />}
          right={
            isMobile ? (
              <SharedRecipients
                className={styles['fil-actionmenu-recipients']}
                docId={docId}
                size="small"
              />
            ) : null
          }
        >
          {isSharedWithMe
            ? t('Files.share.sharedWithMe')
            : isShared
              ? t('Files.share.shared')
              : t('Files.share.cta')}
        </ActionMenuItem>
      )}
    </SharedDocument>
  )
}

ShareMenuItem.contextTypes = {
  t: PropTypes.func.isRequired
}

export default ShareMenuItem
