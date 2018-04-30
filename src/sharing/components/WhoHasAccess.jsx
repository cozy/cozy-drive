import React from 'react'

import Recipient from './Recipient'

const WhoHasAccess = ({
  title,
  isOwner = false,
  recipients,
  document,
  documentType,
  onRevoke
}) => (
  <div>
    {title && <h3>{title}</h3>}
    {recipients
      .filter(r => r.status !== 'revoked')
      .map(recipient => (
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
