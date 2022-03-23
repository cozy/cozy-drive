import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Button } from 'cozy-ui/transpiled/react'
import Input from 'cozy-ui/transpiled/react/Input'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Typography from 'cozy-ui/transpiled/react/Typography'
import flag from 'cozy-flags'

import { defaultBottomSheetSpringConfig } from 'drive/web/modules/viewer/Footer/BottomSheet'
import { logException, logInfo } from 'drive/lib/reporter'
import { setOffline, isOfflineCapable } from '../duck'

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
  const [bottomSheetTension, setBottomSheetTension] = useState(
    defaultBottomSheetSpringConfig.tension
  )
  const [bottomSheetFriction, setBottomSheetFriction] = useState(
    defaultBottomSheetSpringConfig.friction
  )
  const [bottomSheetClamp, setBottomSheetClamp] = useState(
    defaultBottomSheetSpringConfig.clamp
  )

  const handleOnChange = (value, flagName, setter) => {
    flag.store.set(flagName, value)
    setter(value)
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Sentry
      </Typography>
      <Button onClick={() => sendSentryException()} label="send exception" />
      <Button onClick={() => sendSentryMessage()} label="send message" />

      <Typography variant="h4" className="u-mt-1" gutterBottom>
        Offline
      </Typography>
      <Checkbox
        label="Offline"
        value={offline}
        onChange={setOffline}
        checked={offline}
      />

      <Typography variant="h4" className="u-mt-1" gutterBottom>
        Viewer BottomSheet
      </Typography>
      <Typography variant="body1">Tension :</Typography>
      <Input
        value={bottomSheetTension}
        type="number"
        onChange={e =>
          handleOnChange(
            parseFloat(e.target.value),
            'viewer-bottomSheet-tension',
            setBottomSheetTension
          )
        }
      />
      <Typography variant="body1">Friction :</Typography>
      <Input
        value={bottomSheetFriction}
        type="number"
        onChange={e =>
          handleOnChange(
            parseFloat(e.target.value),
            'viewer-bottomSheet-friction',
            setBottomSheetFriction
          )
        }
      />
      <Checkbox
        label="Clamp"
        value={bottomSheetClamp}
        onChange={e =>
          handleOnChange(
            e.target.checked,
            'viewer-bottomSheet-clamp',
            setBottomSheetClamp
          )
        }
        checked={bottomSheetClamp}
      />

      <Typography
        variant="h4"
        className="u-mt-1"
        gutterBottom
        onClick={() => {
          const doctypes = getPersistedDoctypes()
          alert(doctypes)
        }}
      >
        Doctypes Persistés (aka synchronisés au moins une fois)
      </Typography>

      <Typography
        variant="h4"
        className="u-mt-1"
        gutterBottom
        onClick={() => {
          const queries = getPersistedWarmupedQueries()
          alert(queries)
        }}
      >
        Queries de préchauffe (si listées, déjà exécutées)
      </Typography>
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

export default connect(mapStateToProps, mapDispatchToProps)(DebugTools)
