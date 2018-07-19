import React from 'react'
import Recipient from './Recipient'

const WhoHasAccess = (
  { isOwner = false, recipients, document, documentType, onRevoke, className },
  { t }
) => (
  <div className={className}>
    {recipients.length > 1 && (
      <h3>
        {t(`${documentType}.share.whoHasAccess.title`, {
          smart_count: recipients.length
        })}
      </h3>
    )}
    {recipients.map(recipient => (
      <Recipient
        {...recipient}
        isOwner={isOwner}
        document={document}
        documentType={documentType}
        onRevoke={onRevoke}
      />
    ))}
  </div>
)

export default WhoHasAccess
