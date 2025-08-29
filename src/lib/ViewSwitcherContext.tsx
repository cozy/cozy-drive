import React, { 
  useState, 
  useCallback, 
  useContext, 
  createContext, 
  useEffect 
} from 'react'

import { useClient, Q } from 'cozy-client'

import { DOCTYPE_FILES_SETTINGS } from '@/lib/doctypes'
import logger from './logger'

// Constants
const DEFAULT_VIEW_TYPE = 'list'

interface ViewSwitcherContextProps {
  viewType: string
  switchView: (viewTypeParam: string) => Promise<void>
}

const ViewSwitcherContext = createContext<ViewSwitcherContextProps>({
  viewType: DEFAULT_VIEW_TYPE,
  switchView: async () => Promise.resolve() 
})

const ViewSwitcherContextProvider: React.FC = ({ children }) => {
  const client = useClient()
  const [viewType, setViewType] = useState(DEFAULT_VIEW_TYPE)

  const fetchSettings = useCallback(async () => {
    if (!client) return null

    try {
      const { data } = await client.query(Q(DOCTYPE_FILES_SETTINGS))
      return data?.[0] || null
    } catch (error) {
      logger.error('Failed to fetch settings:', error)
      return null
    }
  }, [client])

  const switchView = useCallback(
    async (viewTypeParam: string) => {
      setViewType(viewTypeParam)

      if (!client) {
        logger.warn('Client not available, cannot save view preference')
        return
      }

      try {
        const settings = await fetchSettings()

        if (settings) {
          await client.save({
            ...settings,
            attributes: {
              ...settings.attributes,
              preferredDriveViewType: viewTypeParam
            }
          })
        } else {
          await client.save({
            _type: DOCTYPE_FILES_SETTINGS,
            attributes: {
              preferredDriveViewType: viewTypeParam
            }
          })
        }
      } catch (error) {
        logger.error('Failed to save view preference:', error)
      }
    },
    [client, fetchSettings]
  )

  useEffect(() => {
    const fetchPreferences = async (): Promise<void> => {
      if (!client) return

      try {
        const settings = await fetchSettings()
        const preferredViewType = settings?.attributes
          ?.preferredDriveViewType as string
        setViewType(preferredViewType || DEFAULT_VIEW_TYPE)
      } catch (error) {
        setViewType(DEFAULT_VIEW_TYPE)
      }
    }

    void fetchPreferences()
  }, [client, fetchSettings])

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
