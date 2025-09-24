import logger from '@/lib/logger'
import React, { createContext, useContext, useState, useCallback } from 'react'

const UploadContext = createContext()

export const UploadProvider = ({ children }) => {
  const [newItems, setNewItems] = useState([])

  const addNewItems = items => {
    setNewItems(prev => {
      const existingIds = prev.map(item => item._id)
      const uniqueItems = (Array.isArray(items) ? items : [items]).filter(
        item => item && item._id && !existingIds.includes(item._id)
      )
      return [...prev, ...uniqueItems]
    })
  }

  const clearNewItems = () => setNewItems([])

  const isNewItem = item => {
    logger.info('item', item)
    logger.info('newItems', newItems)
    return newItems.some(newItem => newItem._id === item._id)
  }

  const value = {
    newItems,
    addNewItems,
    clearNewItems,
    isNewItem
  }

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  )
}

const useUploadContext = () => useContext(UploadContext)

export { UploadProvider, useUploadContext }