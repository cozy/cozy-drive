import React, { createContext, useState, useContext } from 'react'

export const NavContext = createContext()

export const NavProvider = ({ children }) => {
  const clickState = useState(null)

  return (
    <NavContext.Provider value={clickState}>{children}</NavContext.Provider>
  )
}

export const useNavContext = () => {
  const context = useContext(NavContext)
  if (context === undefined) {
    throw new Error('useNavContext must be used within a NavProvider')
  }
  return context
}
