import React, { useState, useCallback, useContext, ReactNode } from 'react'

interface TModalContext {
  modalStack: JSX.Element[]
  pushModal: (modal: JSX.Element) => void
  popModal: () => void
}

export const ModalContext = React.createContext<TModalContext | undefined>(
  undefined
)

interface ModalContextProviderProps {
  children: ReactNode
}

export const ModalContextProvider: React.FC<ModalContextProviderProps> = ({
  children
}) => {
  const [modalStack, setModalStack] = useState<JSX.Element[]>([])

  const pushModal = useCallback((modal: JSX.Element) => {
    setModalStack(prevStack => [...prevStack, modal])
  }, [])

  const popModal = useCallback(() => {
    setModalStack(prevStack => prevStack.slice(0, prevStack.length - 1))
  }, [])

  return (
    <ModalContext.Provider value={{ modalStack, pushModal, popModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = (): TModalContext => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error(
      'useModalContext must be used within a ModalContextProvider'
    )
  }
  return context
}

export const ModalStack = (): JSX.Element | null => {
  const { modalStack } = useModalContext()

  if (modalStack.length === 0) return null
  else return modalStack[modalStack.length - 1]
}
