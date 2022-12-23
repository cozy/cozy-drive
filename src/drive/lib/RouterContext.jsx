import React, { useContext } from 'react'

export const RouterContext = React.createContext()

export const RouterContextProvider = ({
  children,
  router,
  params,
  location,
  routes
}) => {
  return (
    <RouterContext.Provider value={{ router, params, location, routes }}>
      {children}
    </RouterContext.Provider>
  )
}

export const useRouter = () => {
  return useContext(RouterContext)
}
