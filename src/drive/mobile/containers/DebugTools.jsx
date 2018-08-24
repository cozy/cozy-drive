/* global cozy */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logException, logInfo } from '../lib/reporter'
import { setFirstReplication, setOffline } from '../actions/settings'
import { isFirstReplicationDone, isOfflineCapable } from '../reducers/settings'
import { Button } from 'cozy-ui/react'

const Checkbox = ({ onChange, value, title }) => (
  <div>
    {title} <input type="checkbox" checked={value} onChange={onChange} />
  </div>
)

class DebugTools extends Component {
  sendSentryException() {
    logException('a debug exception')
  }

  sendSentryMessage() {
    logInfo('a debug message')
  }

  stopReplication() {
    cozy.client.offline.stopRepeatedReplication('io.cozy.files')
  }

  render() {
    return (
      <div>
        <h4>Sentry</h4>
        <Button
          onClick={() => this.sendSentryException()}
          label="send exception"
        />
        <Button onClick={() => this.sendSentryMessage()} label="send message" />
        <h4>Offline</h4>
        <Checkbox
          title="First Replication"
          value={this.props.firstReplication}
          onChange={this.props.setFirstReplication}
        />
        <Checkbox
          title="Offline"
          value={this.props.offline}
          onChange={this.props.setOffline}
        />
        <h4>Pouchdb</h4>
        <Button
          onClick={() => this.stopReplication()}
          label="stop replication"
        />
        <hr />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  firstReplication: isFirstReplicationDone(state),
  offline: isOfflineCapable(state)
})

const mapDispatchToProps = dispatch => ({
  setFirstReplication: e => dispatch(setFirstReplication(e.target.checked)),
  setOffline: e => dispatch(setOffline(e.target.checked))
})

export default connect(mapStateToProps, mapDispatchToProps)(DebugTools)
