import React, { createContext, useContext, ReactNode } from 'react'

interface PublicContextType {
  isPublic: boolean
}

const PublicContext = createContext<PublicContextType | undefined>({
  isPublic: false
})

interface PublicProviderProps {
  children: ReactNode
  isPublic?: boolean
}

const PublicProvider: React.FC<PublicProviderProps> = ({
  children,
  isPublic = false
}) => {
  const value = {
    isPublic
  }

  return (
    <PublicContext.Provider value={value}>{children}</PublicContext.Provider>
  )
}

const usePublicContext = (): PublicContextType => {
  const context = useContext(PublicContext)
  if (context === undefined) {
    throw new Error('usePublicContext must be used within a PublicProvider')
  }
  return context
}

export { PublicProvider, usePublicContext }
