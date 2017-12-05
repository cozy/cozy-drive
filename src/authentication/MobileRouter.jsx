import React from 'react'
import { Router, withRouter } from 'react-router'

import Authentication from './Authentication'
import Revoked from './Revoked'

const MobileRouter = ({
  history,
  appRoutes,
  isAuthenticated,
  isRevoked,
  onAuthenticated,
  onLogout
}) => {
  if (!isAuthenticated) {
    return <Authentication router={history} onComplete={onAuthenticated} />
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
