import React, { useState, useCallback, useContext } from 'react'

export const ModalContext = React.createContext()

export const ModalContextProvider = ({ children }) => {
  const [modalStack, setModalStack] = useState([])
  const pushModal = useCallback(
    modal => {
      modalStack.push(modal)
      setModalStack([...modalStack])
    },
    [modalStack]
  )
  const popModal = useCallback(() => {
    modalStack.pop()
    setModalStack([...modalStack])
  }, [modalStack])

  return (
    <ModalContext.Provider value={{ modalStack, pushModal, popModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)

export const ModalStack = () => {
  const { modalStack } = useModalContext()

  if (modalStack.length === 0) return null
  else return modalStack[modalStack.length - 1]
}
