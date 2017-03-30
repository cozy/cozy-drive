import React from 'react'
import { logException, logInfo } from '../lib/reporter'

const Button = ({ onClick, children }) => (
  <button onclick={onClick} className={'coz-btn coz-btn--regular'}>
    {children}
  </button>
)

class DebugTools extends React.Component {
  sendSentryException () {
    logException('a debug exception')
  }
  sendSentryMessage () {
    logInfo('a debug message')
  }

  render () {
    return (
      <div>
        <h4>Sentry</h4>
        <Button onClick={() => this.sendSentryException()}>send exception</Button>
        <Button onClick={() => this.sendSentryMessage()}>send message</Button>
      </div>
    )
  }
}

export default DebugTools
