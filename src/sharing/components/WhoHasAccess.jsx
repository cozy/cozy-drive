import React, { PureComponent } from 'react'
import Recipient from './Recipient'
import { SubTitle } from 'cozy-ui/react'

class WhoHasAccess extends PureComponent {
  render() {
    const {
      isOwner = false,
      recipients,
      document,
      documentType,
      onRevoke,
      className
    } = this.props
    const { t } = this.context

    return (
      <div className={className}>
        {recipients.length > 1 && (
          <SubTitle>
            {t(`${documentType}.share.whoHasAccess.title`, {
              smart_count: recipients.length
            })}
          </SubTitle>
        )}
        {recipients.map((recipient, index) => (
          <Recipient
            {...recipient}
            key={`key_r_${index}`}
            isOwner={isOwner}
            document={document}
            documentType={documentType}
            onRevoke={onRevoke}
          />
        ))}
      </div>
    )
  }
}

export default WhoHasAccess
