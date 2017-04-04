import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logException, logInfo } from '../lib/reporter'
import { setFirstReplication, setOffline } from '../../../src/actions'

const Button = ({ onClick, children }) => (
  <button onclick={onClick} className={'coz-btn coz-btn--regular'}>
    {children}
  </button>
)

const Checkbox = ({ onChange, value, title }) => (
  <div>
    {title} <input type='checkbox' checked={value} onChange={onChange} />
  </div>
)

class DebugTools extends Component {
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
        <h4>Offline</h4>
        <Checkbox title='First Replication' value={this.props.firstReplication} onChange={this.props.setFirstReplication} />
        <Checkbox title='Offline' value={this.props.offline} onChange={this.props.setOffline} />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  setFirstReplication: (e) => dispatch(setFirstReplication(e.target.checked)),
  setOffline: (e) => dispatch(setOffline(e.target.checked))
})

const mapStateToProps = (state) => ({
  firstReplication: state.settings.firstReplication,
  offline: state.settings.offline
})

export default connect(mapStateToProps, mapDispatchToProps)(DebugTools)
