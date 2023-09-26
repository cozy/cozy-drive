import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  useContext
} from 'react'
import { useSearchParams } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { officeDefaultMode } from 'drive/web/modules/views/OnlyOffice/helpers'

const OnlyOfficeContext = createContext()

const OnlyOfficeProvider = ({
  fileId,
  isPublic,
  isReadOnly,
  isFromSharing,
  username,
  isInSharedFolder,
  children
}) => {
  const { isDesktop, isMobile } = useBreakpoints()
  const [searchParam] = useSearchParams()
  const [isEditorReady, setIsEditorReady] = useState(false)

  const [editorMode, setEditorMode] = useState(
    officeDefaultMode(isDesktop, isMobile)
  )
  const isEditorModeView = useMemo(() => editorMode === 'view', [editorMode])

  useEffect(() => {
    if (searchParam.get('fromCreate') === 'true') {
      setEditorMode('edit')
    }
  }, [searchParam])

  return (
    <OnlyOfficeContext.Provider
      value={{
        fileId,
        isPublic,
        isReadOnly,
        isFromSharing,
        username,
        isInSharedFolder,
        isEditorReady,
        setIsEditorReady,
        editorMode,
        setEditorMode,
        isEditorModeView
      }}
    >
      {children}
    </OnlyOfficeContext.Provider>
  )
}

const useOnlyOfficeContext = () => useContext(OnlyOfficeContext)

export { OnlyOfficeContext, OnlyOfficeProvider, useOnlyOfficeContext }
