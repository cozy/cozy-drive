import React from 'react'
import ReactTooltip from 'react-tooltip'
import cx from 'classnames'
import Icon from 'cozy-ui/react/Icon'
import { getDisplayName } from '..'

import styles from './status'
import linkIcon from '../assets/icons/icon-link-grey.svg'

const SharedStatus = ({ className, docId, recipients, link }, { t }) => (
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
    )}
    {link && <Icon icon={linkIcon} />}
  </span>
)

export default SharedStatus
