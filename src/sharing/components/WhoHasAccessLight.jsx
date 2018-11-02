import React from 'react'
import cx from 'classnames'
import { RecipientWithoutStatus, RecipientPlusX } from './Recipient'

import styles from './recipient'

const MAX_DISPLAYED_RECIPIENTS = 2

const WhoHasAccessLight = ({ recipients, className }) => (
  <div className={cx(styles['recipients-list-light'], className)}>
    {recipients.slice(0, MAX_DISPLAYED_RECIPIENTS).map(recipient => (
      <RecipientWithoutStatus {...recipient} />
    ))}
    {recipients.length > MAX_DISPLAYED_RECIPIENTS && (
      <RecipientPlusX
        extraRecipients={recipients.slice(MAX_DISPLAYED_RECIPIENTS)}
      />
    )}
  </div>
)

export default WhoHasAccessLight
