import React from 'react'
import { Router, withRouter } from 'react-router'

import Authentication from './src/Authentication'
import Revoked from './src/Revoked'
import { logException } from 'drive/mobile/lib/reporter'

const MobileRouter = ({
  history,
  appRoutes,
  isAuthenticated,
  isRevoked,
  onAuthenticated,
  onLogout
}) => {
  if (!isAuthenticated) {
    return (
      <Authentication
        router={history}
        onComplete={onAuthenticated}
        onException={logException}
      />
    )
  } else if (isRevoked) {
    return (
      <Revoked
        router={history}
        onLogBackIn={onAuthenticated}
        onLogout={onLogout}
      />
    )
  } else {
    return <Router history={history}>{appRoutes}</Router>
  }
}

export default withRouter(MobileRouter)
