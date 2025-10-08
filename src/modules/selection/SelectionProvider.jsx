import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback
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
 * @property {Function} selectAll Select all items
 * @property {Function} clearSelection Clear all the selected items
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
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null)
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false)
  const itemsListRef = useRef([])

  const setItemsList = items => {
    itemsListRef.current = items
  }

  const isItemSelected = id => {
    return selectedItems[id] !== undefined
  }

  const toggleSelectedItem = (item, index = null) => {
    if (item._id === SHARED_DRIVES_DIR_ID) {
      return
    }

    if (isItemSelected(item._id)) {
      // eslint-disable-next-line no-unused-vars
      const { [item._id]: _, ...stillSelected } = selectedItems
      setSelectedItems(stillSelected)
      setLastSelectedIndex(null)
    } else {
      setSelectedItems({ ...selectedItems, [item._id]: item })
      if (index !== null) {
        setLastSelectedIndex(index)
        setFocusedIndex(index)
      }
    }
  }

  const selectRange = (startIndex, endIndex) => {
    const start = Math.min(startIndex, endIndex)
    const end = Math.max(startIndex, endIndex)

    const newSelectedItems = { ...selectedItems }

    for (let i = start; i <= end; i++) {
      const item = itemsListRef.current[i]
      if (!item || item._id === SHARED_DRIVES_DIR_ID) continue

      if (newSelectedItems[item._id] && i !== start) {
        delete newSelectedItems[item._id]
      } else {
        newSelectedItems[item._id] = item
      }
    }

    setSelectedItems(newSelectedItems)
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
    if (!allItems || allItems.length === 0) return

    const clamp = i => Math.max(0, Math.min(allItems.length - 1, i))

    if (lastSelectedIndex === null && Object.keys(selectedItems).length === 0) {
      let firstValidIndex = 0
      if (allItems[0]?._id === SHARED_DRIVES_DIR_ID && allItems.length > 1) {
        firstValidIndex = 1
      }

      const firstItem = allItems[firstValidIndex]
      if (firstItem && firstItem._id !== SHARED_DRIVES_DIR_ID) {
        const newSelectedItems = { [firstItem._id]: firstItem }
        setSelectedItems(newSelectedItems)
        setFocusedIndex(firstValidIndex)
        setLastSelectedIndex(firstValidIndex)
        setIsKeyboardNavigating(true)
      }
      return
    }

    const prevFocused = focusedIndex
    const anchorIndex =
      lastSelectedIndex !== null ? lastSelectedIndex : prevFocused
    const startSelected =
      !!allItems[anchorIndex] && isItemSelected(allItems[anchorIndex]?._id)

    let nextFocused = clamp(prevFocused + (direction < 0 ? -1 : 1))

    const newSelectedItems = { ...selectedItems }

    const step = direction < 0 ? -1 : 1

    if (startSelected) {
      const movingAway =
        (anchorIndex <= prevFocused && step === 1) ||
        (anchorIndex >= prevFocused && step === -1)

      if (movingAway) {
        while (
          nextFocused >= 0 &&
          nextFocused < allItems.length &&
          isItemSelected(allItems[nextFocused]?._id)
        ) {
          const nf = nextFocused + step
          if (nf < 0 || nf >= allItems.length) break
          nextFocused = nf
        }

        let i = prevFocused + step
        while (i >= 0 && i < allItems.length) {
          const it = allItems[i]
          if (it && it._id !== SHARED_DRIVES_DIR_ID) {
            newSelectedItems[it._id] = it
          }
          if (i === nextFocused) break
          i += step
        }
      } else {
        let i = prevFocused
        while (i >= 0 && i < allItems.length && i !== nextFocused) {
          const it = allItems[i]
          if (it) delete newSelectedItems[it._id]
          i -= step
        }
      }
    } else {
      let i = prevFocused + step
      while (i >= 0 && i < allItems.length) {
        const it = allItems[i]
        if (it) delete newSelectedItems[it._id]
        if (i === nextFocused) break
        i += step
      }
    }

    setSelectedItems(newSelectedItems)
    setFocusedIndex(nextFocused)
    setIsKeyboardNavigating(true)
    setLastSelectedIndex(anchorIndex)
  }

  const selectAll = items => {
    const newSelectedItems = items.reduce((acc, item) => {
      acc[item._id] = item
      return acc
    }, {})
    setSelectedItems(newSelectedItems)
  }

  const clearSelection = useCallback(() => {
    setSelectedItems({})
    setLastSelectedIndex(null)
    setFocusedIndex(0)
  }, [])

  const toggleSelectAllItems = items => {
    if (isSelectAll) {
      clearSelection()
    } else {
      selectAll(items)
    }
  }

  const showSelectionBar = () => setSelectionBarOpen(true)
  const hideSelectionBar = useCallback(() => {
    clearSelection()
    setSelectionBarOpen(false)
  }, [clearSelection])

  const isSelectionBarVisible = useMemo(() => {
    return Object.keys(selectedItems).length !== 0 || isSelectionBarOpen
  }, [isSelectionBarOpen, selectedItems])

  const isSelectAll = useMemo(() => {
    return (
      itemsListRef.current.length > 0 &&
      Object.keys(selectedItems).length === itemsListRef.current.length
    )
  }, [selectedItems])

  useEffect(() => {
    hideSelectionBar()
  }, [location, hideSelectionBar])

  return (
    <SelectionContext.Provider
      value={{
        showSelectionBar,
        hideSelectionBar,
        clearSelection,
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
        isKeyboardNavigating,
        setLastSelectedIndex,
        setSelectedItems
      }}
    >
      {children}
    </SelectionContext.Provider>
  )
}

const useSelectionContext = () => useContext(SelectionContext)

export { SelectionProvider, useSelectionContext }
