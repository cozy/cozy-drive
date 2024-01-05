import React, { createContext, useState } from 'react'

export const FabContext = createContext()

const FabProvider = ({ children }) => {
  const [isFabDisplayed, setIsFabDisplayed] = useState(false)

  return (
    <FabContext.Provider value={{ isFabDisplayed, setIsFabDisplayed }}>
      {children}
    </FabContext.Provider>
  )
}

export default FabProvider
