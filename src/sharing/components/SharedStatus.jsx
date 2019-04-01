import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { SharingTooltip, TooltipRecipientList } from './Tooltip'
import cx from 'classnames'
import Icon from 'cozy-ui/react/Icon'
import { getDisplayName } from '..'

import styles from './status.styl'
import linkIcon from '../assets/icons/icon-link.svg'

const SharedStatus = ({ className, docId, recipients, link, t }) => (
  <span className={cx(className, styles['shared-status'])}>
    {recipients.length > 1 && (
      <a
        data-tip
        data-for={`members${docId}`}
        className={styles['shared-status-label']}
      >
        {t('Share.members.count', { count: recipients.length })}
      </a>
    )}
    {recipients.length > 1 && (
      <SharingTooltip id={`members${docId}`}>
        <TooltipRecipientList
          recipientNames={recipients.map(recipient =>
            getDisplayName(recipient)
          )}
        />
      </SharingTooltip>
    )}
    {link && <Icon icon={linkIcon} />}
  </span>
)

export default translate()(SharedStatus)
