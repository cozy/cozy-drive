import React from 'react'
import { Router, withRouter } from 'react-router'

import { Authentication, Revoked } from 'cozy-authentication'

import { logException } from 'drive/lib/reporter'

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
