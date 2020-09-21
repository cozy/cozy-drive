import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'cozy-ui/transpiled/react'
import { logException, logInfo } from 'drive/lib/reporter'
import { setOffline, isOfflineCapable } from '../duck'

const Checkbox = ({ onChange, value, title }) => (
  <div>
    {title} <input type="checkbox" checked={value} onChange={onChange} />
  </div>
)

const sendSentryException = () => logException('a debug exception')

const sendSentryMessage = () => logInfo('a debug message')

const getPersistedDoctypes = () => {
  return JSON.parse(
    window.localStorage.getItem('cozy-client-pouch-link-synced')
  )
}
const getPersistedWarmupedQueries = () => {
  return window.localStorage.getItem('cozy-client-pouch-link-warmupedqueries')
}
const DebugTools = ({ offline, setOffline }) => {
  return (
    <div>
      <h4>Sentry</h4>
      <Button onClick={() => sendSentryException()} label="send exception" />
      <Button onClick={() => sendSentryMessage()} label="send message" />
      <h4>Offline</h4>
      <Checkbox title="Offline" value={offline} onChange={setOffline} />
      <h4
        onClick={() => {
          const doctypes = getPersistedDoctypes()
          alert(doctypes)
        }}
      >
        Doctypes Persistés (aka synchronisés au moins une fois)
      </h4>
      <h4
        onClick={() => {
          const queries = getPersistedWarmupedQueries()
          alert(queries)
        }}
      >
        Queries de préchauffe (si listées, déjà exécutées)
      </h4>
      <hr />
    </div>
  )
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
