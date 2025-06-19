import React, {
  useContext,
  useState,
  createContext,
  useMemo,
  useCallback
} from 'react'

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
  const [id, setId] = useState('')

  const onOpen = useCallback((ev, eventId) => {
    ev.preventDefault()
    ev.stopPropagation()

    setId(eventId)
    setPosition({
      mouseX: ev.clientX - 2,
      mouseY: ev.clientY - 4
    })
  }, [])

  const onClose = () => setPosition(initialPosition)

  const value = useMemo(
    () => ({
      position,
      isOpen: attr =>
        attr === id && position.mouseY !== null && position.mouseX !== null,
      onOpen,
      onClose
    }),
    [position, id, onOpen]
  )

  return (
    <RightClickContext.Provider value={value}>
      {children}
    </RightClickContext.Provider>
  )
}

export default RightClickProvider
