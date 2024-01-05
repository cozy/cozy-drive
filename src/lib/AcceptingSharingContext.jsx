import React, { createContext, useState } from 'react'

const AcceptingSharingContext = createContext()

const AcceptingSharingProvider = ({ children }) => {
  const [sharingsValue, setSharingsValue] = useState({})
  const [fileValue, setFileValue] = useState()
  const contextValue = {
    sharingsValue,
    setSharingsValue,
    fileValue,
    setFileValue
  }

  return (
    <AcceptingSharingContext.Provider value={contextValue}>
      {children}
    </AcceptingSharingContext.Provider>
  )
}

export default AcceptingSharingContext

export { AcceptingSharingProvider }
