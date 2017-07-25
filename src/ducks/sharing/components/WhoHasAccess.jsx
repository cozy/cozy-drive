import React from 'react'

import Recipient from './Recipient'
import { getRecipients } from '..'

const WhoHasAccess = ({ recipients }) => (
  <div>
    {recipients.map(({email, url, status}) => (
      <Recipient name={email} url={url} status={status} />
    ))}
  </div>
)

class StatefulWhoHasAccess extends React.Component {
  state = {
    recipients: []
  }

  componentDidMount () {
    const { _id, _type } = this.props.document
    const { t } = this.context
    getRecipients(_id, _type)
    .then(recipients =>
      recipients.map(recipient => {
        const status = recipient.status === 'accepted'
         ? t(`Share.status.${recipient.status}.${recipient.type}`)
         : t(`Share.status.${recipient.status}`)
        return {
          ...recipient,
          status
        }
      })
    )
    .then(recipients => {
      this.setState(state => ({ ...state, recipients }))
    })
    .catch(console.error.bind(console))
  }

  render () {
    return <WhoHasAccess recipients={this.state.recipients} />
  }
}

export default StatefulWhoHasAccess
