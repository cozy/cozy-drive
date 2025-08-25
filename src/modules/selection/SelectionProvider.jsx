import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef
} from 'react'
import { useLocation } from 'react-router-dom'

import { SHARED_DRIVES_DIR_ID } from '@/constants/config'

/**
 * @typedef TSelectionContext
 * @property {Function} showSelectionBar Show the SelectionBar
 * @property {Function} hideSelectionBar Hide the SelectionBar
 * @property {boolean} isSelectionBarVisible Whether the SelectionBar is visible or not
 * @property {Array} selectedItems List of selected items
 * @property {Function} toggleSelectedItem Select an item if it is already selected, otherwise deselect it
 * @property {Function} isItemSelected Find out if an item is selected by its id
 * @property {boolean} isSelectAll Whether all the items are selected or not
 * @property {Function} toggleSelectAllItems Toggle selects all items
 * @property {Function} selectRange Select a range of items between two indices
 * @property {Function} setItemsList Set the current list of items for range selection
 * @property {Function} handleShiftClick Handle shift+click selection
 * @property {Function} handleShiftArrow Handle keyboard navigation selection
 * @property {number} focusedIndex Current focused item index
 * @property {Function} setFocusedIndex Set the focused item index
 */

/** @type {import('react').Context<TSelectionContext>} */
const SelectionContext = createContext()

/**
 * This provider allows you to manage item selection
 */
const SelectionProvider = ({ children }) => {
  const location = useLocation()
  const [selectedItems, setSelectedItems] = useState({})
  const [isSelectionBarOpen, setSelectionBarOpen] = useState(false)
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null)
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false)
  const itemsListRef = useRef([])

  const setItemsList = items => {
    itemsListRef.current = items
  }

  const toggleSelectedItem = (item, index = null) => {
    if (item.id === SHARED_DRIVES_DIR_ID) {
      return
    }

    if (isItemSelected(item.id)) {
      // eslint-disable-next-line no-unused-vars
      const { [item.id]: _, ...stillSelected } = selectedItems
      setSelectedItems(stillSelected)
    } else {
      setSelectedItems({ ...selectedItems, [item.id]: item })
      if (index !== null) {
        setLastSelectedIndex(index)
        setFocusedIndex(index)
      }
    }
  }

  const selectExactRange = (items, startIndex, endIndex) => {
    const start = Math.min(startIndex, endIndex)
    const end = Math.max(startIndex, endIndex)
    const newSelectedItems = {}
    for (let i = start; i <= end; i++) {
      const item = items[i]
      if (item && item.id !== SHARED_DRIVES_DIR_ID) {
        newSelectedItems[item.id] = item
      }
    }
    setSelectedItems(newSelectedItems)
  }

  const selectRange = (startIndex, endIndex) => {
    const start = Math.min(startIndex, endIndex)
    const end = Math.max(startIndex, endIndex)

    const newSelectedItems = {}
    for (let i = start; i <= end; i++) {
      const item = itemsListRef.current[i]
      if (item) {
        newSelectedItems[item.id] = item
      }
    }
    setSelectedItems(prev => ({ ...prev, ...newSelectedItems }))
  }

  const handleShiftClick = (item, clickedIndex) => {
    if (lastSelectedIndex !== null) {
      selectRange(lastSelectedIndex, clickedIndex)
    } else {
      toggleSelectedItem(item, clickedIndex)
    }
    setLastSelectedIndex(clickedIndex)
    setFocusedIndex(clickedIndex)
  }

  const handleShiftArrow = (direction, items = []) => {
    const allItems = items.length === 0 ? itemsListRef.current : items

    let newFocusedIndex = focusedIndex

    if (direction === -1) {
      newFocusedIndex = Math.max(0, focusedIndex - 1)
    } else if (direction === 1) {
      newFocusedIndex = Math.min(allItems.length - 1, focusedIndex + 1)
    }

    setFocusedIndex(newFocusedIndex)
    setIsKeyboardNavigating(true)

    const anchorIndex =
      lastSelectedIndex !== null ? lastSelectedIndex : focusedIndex
    if (lastSelectedIndex === null) {
      setLastSelectedIndex(focusedIndex)
    }
    selectExactRange(allItems, anchorIndex, newFocusedIndex)
  }

  const selectAll = items => {
    setIsSelectAll(true)
    const newSelectedItems = items.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
    setSelectedItems(newSelectedItems)
  }

  const toggleSelectAllItems = items => {
    if (isSelectAll) {
      setIsSelectAll(false)
      setSelectedItems({})
    } else {
      selectAll(items)
    }
  }

  const showSelectionBar = () => setSelectionBarOpen(true)
  const hideSelectionBar = () => {
    setIsSelectAll(false)
    setSelectedItems({})
    setSelectionBarOpen(false)
    setLastSelectedIndex(null)
    setFocusedIndex(0)
  }

  const isSelectionBarVisible = useMemo(() => {
    return Object.keys(selectedItems).length !== 0 || isSelectionBarOpen
  }, [isSelectionBarOpen, selectedItems])

  const isItemSelected = id => {
    return selectedItems[id] !== undefined
  }

  useEffect(() => {
    hideSelectionBar()
  }, [location])

  return (
    <SelectionContext.Provider
      value={{
        showSelectionBar,
        hideSelectionBar,
        isSelectionBarVisible,
        selectedItems: Object.values(selectedItems),
        toggleSelectedItem,
        selectAll,
        isItemSelected,
        isSelectAll,
        toggleSelectAllItems,
        selectRange,
        setItemsList,
        handleShiftClick,
        handleShiftArrow,
        focusedIndex,
        setFocusedIndex,
        isKeyboardNavigating
      }}
    >
      {children}
    </SelectionContext.Provider>
  )
}

const useSelectionContext = () => useContext(SelectionContext)

export { SelectionProvider, useSelectionContext }
