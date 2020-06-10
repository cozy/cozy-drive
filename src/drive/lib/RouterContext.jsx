import React from 'react'
import { withRouter } from 'react-router'

export const RouterContext = React.createContext()

export const RouterContextProvider = withRouter(
  ({ children, router, params, location, routes }) => {
    return (
      <RouterContext.Provider value={{ router, params, location, routes }}>
        {children}
      </RouterContext.Provider>
    )
  }
)
