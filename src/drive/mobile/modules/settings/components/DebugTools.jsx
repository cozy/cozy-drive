import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'cozy-ui/transpiled/react'
import { logException, logInfo } from 'drive/lib/reporter'
import { setOffline, isOfflineCapable } from '../duck'

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
        <hr />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  offline: isOfflineCapable(state)
})

const mapDispatchToProps = dispatch => ({
  setOffline: e => dispatch(setOffline(e.target.checked))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DebugTools)
