import React, { useState, useCallback } from 'react'

export const ThumbnailSizeContext = React.createContext()

export const ThumbnailSizeContextProvider = ({ children }) => {
  const [isBigThumbnail, setIsBigThumbnail] = useState(false)
  const toggleThumbnailSize = useCallback(
    () => setIsBigThumbnail(!isBigThumbnail),
    [isBigThumbnail, setIsBigThumbnail]
  )

  return (
    <ThumbnailSizeContext.Provider
      value={{ isBigThumbnail, toggleThumbnailSize }}
    >
      {children}
    </ThumbnailSizeContext.Provider>
  )
}
