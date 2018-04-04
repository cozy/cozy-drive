import React from 'react'

import Recipient from './Recipient'

const WhoHasAccess = ({ recipients, documentType, onUnshare }) => (
  <div>
    {recipients
      .filter(r => r.status !== 'revoked')
      .map(({ contact, status, type }) => (
        <Recipient
          contact={contact}
          status={status}
          type={type}
          documentType={documentType}
          onUnshare={onUnshare}
        />
      ))}
  </div>
)

export default WhoHasAccess
