import React from 'react'
import ReactTooltip from 'react-tooltip'
import { getDisplayName } from '..'

import styles from './status'

const SharedStatus = ({ className, docId, recipients }, { t }) => (
  <span className={className}>
    <a data-tip data-for={`members${docId}`}>
      {t('Share.members.count', { count: recipients.length })}
    </a>
    <ReactTooltip
      id={`members${docId}`}
      className={styles['shared-status-members']}
    >
      <ul>
        {recipients.slice(0, 4).map(r => <li>{getDisplayName(r)}</li>)}
        {recipients.length > 4 && (
          <li>
            {t('Share.members.others', {
              smart_count: recipients.slice(4).length
            })}
          </li>
        )}
      </ul>
    </ReactTooltip>
  </span>
)

export default SharedStatus
