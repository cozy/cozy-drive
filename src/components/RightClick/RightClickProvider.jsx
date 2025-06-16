import React, { useContext, useState, createContext, useMemo } from 'react'

const initialPosition = {
  mouseX: null,
  mouseY: null
}

const RightClickContext = createContext()

export const useRightClick = () => {
  const context = useContext(RightClickContext)

  if (!context) {
    throw new Error('useRightClick must be used within a RightClickProvider')
  }
  return context
}

const RightClickProvider = ({ children }) => {
  const [position, setPosition] = useState(initialPosition)

  const value = useMemo(
    () => ({
      position,
      setPosition,
      isOpen: position.mouseY !== null && position.mouseX !== null,
      onClose: () => setPosition(initialPosition)
    }),
    [position]
  )

  return (
    <RightClickContext.Provider value={value}>
      {children}
    </RightClickContext.Provider>
  )
}

export default RightClickProvider
