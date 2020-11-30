import React, { createContext, useState } from 'react'

const SharingsContext = createContext()

const SharingsContextProvider = ({ children }) => {
  const [sharingsValue, setSharingsValue] = useState({})
  const [fileValue, setFileValue] = useState()
  const contextValue = {
    sharingsValue,
    setSharingsValue,
    fileValue,
    setFileValue
  }

  return (
    <SharingsContext.Provider value={contextValue}>
      {children}
    </SharingsContext.Provider>
  )
}

export default SharingsContext

export { SharingsContextProvider }
