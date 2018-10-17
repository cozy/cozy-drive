import React from 'react'
import Recipient from './Recipient'
import { SubTitle } from 'cozy-ui/react'

const WhoHasAccess = (
  { isOwner = false, recipients, document, documentType, onRevoke, className },
  { t }
) => (
  <div className={className}>
    {recipients.length > 1 && (
      <SubTitle>
        {t(`${documentType}.share.whoHasAccess.title`, {
          smart_count: recipients.length
        })}
      </SubTitle>
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
