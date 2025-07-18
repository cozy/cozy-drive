import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect
} from 'react'
import { useLocation } from 'react-router-dom'

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

  const toggleSelectedItem = item => {
    if (isItemSelected(item.id)) {
      // eslint-disable-next-line no-unused-vars
      const { [item.id]: _, ...stillSelected } = selectedItems
      setSelectedItems(stillSelected)
    } else {
      setSelectedItems({ ...selectedItems, [item.id]: item })
    }
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
        toggleSelectAllItems
      }}
    >
      {children}
    </SelectionContext.Provider>
  )
}

const useSelectionContext = () => useContext(SelectionContext)

export { SelectionProvider, useSelectionContext }
