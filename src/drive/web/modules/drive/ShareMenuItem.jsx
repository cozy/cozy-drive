import React from 'react'

import { SharedRecipients } from 'cozy-sharing'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'

import styles from 'drive/styles/actionmenu.styl'

const ShareMenuItem = ({ docId, onClick }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  return (
    <ActionMenuItem
      onClick={onClick}
      left={<Icon icon={ShareIcon} />}
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
      {t('Files.share.cta')}
    </ActionMenuItem>
  )
}

export default ShareMenuItem
