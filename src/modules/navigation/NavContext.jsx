import React, { createContext, useState, useContext } from 'react'

// Create a context for navigation state
export const NavContext = createContext()

// Provider component
export const NavProvider = ({ children }) => {
  const clickState = useState(null)

  return (
    <NavContext.Provider value={clickState}>{children}</NavContext.Provider>
  )
}

// Hook to use the nav context
export const useNavContext = () => {
  const context = useContext(NavContext)
  if (context === undefined) {
    throw new Error('useNavContext must be used within a NavProvider')
  }
  return context
}
