import React, { useState, useCallback, useContext, createContext } from 'react'

interface ViewSwitcherContextProps {
  viewType: string
  switchView: (viewTypeParam: string) => void
}

const ViewSwitcherContext = createContext<ViewSwitcherContextProps>({
  viewType: 'list',
  switchView: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
})

const ViewSwitcherContextProvider: React.FC = ({ children }) => {
  const [viewType, setViewType] = useState('list')

  const switchView = useCallback(
    (viewTypeParam: string) => setViewType(viewTypeParam),
    [setViewType]
  )

  return (
    <ViewSwitcherContext.Provider value={{ viewType, switchView }}>
      {children}
    </ViewSwitcherContext.Provider>
  )
}

const useViewSwitcherContext = (): ViewSwitcherContextProps =>
  useContext(ViewSwitcherContext)

export {
  ViewSwitcherContext,
  ViewSwitcherContextProvider,
  useViewSwitcherContext
}
