import { combineReducers, createStore } from 'redux'
import reducer, {
  showSelectionBar,
  hideSelectionBar,
  toggleSelectionBar,
  isSelectionBarVisible,
  toggleItemSelection,
  isSelected,
  getSelectedFiles
} from './duck.js'

describe('selection store', () => {
  const setup = () => createStore(combineReducers({ selection: reducer }))

  const item1 = { id: 1, name: 'item 1' }
  const item2 = { id: 2, name: 'item 2' }

  it('shows and hides the selection bar', () => {
    const store = setup()

    store.dispatch(showSelectionBar())
    expect(isSelectionBarVisible(store.getState())).toBe(true)
    store.dispatch(showSelectionBar())
    expect(isSelectionBarVisible(store.getState())).toBe(true)

    store.dispatch(hideSelectionBar())
    expect(isSelectionBarVisible(store.getState())).toBe(false)
    store.dispatch(hideSelectionBar())
    expect(isSelectionBarVisible(store.getState())).toBe(false)

    store.dispatch(toggleSelectionBar())
    expect(isSelectionBarVisible(store.getState())).toBe(true)
    store.dispatch(toggleSelectionBar())
    expect(isSelectionBarVisible(store.getState())).toBe(false)
  })

  it('selects and deselects item', () => {
    const store = setup()

    // selecting one item
    store.dispatch(toggleItemSelection(item1, false))
    expect(isSelected(store.getState(), item1)).toBe(true)
    expect(isSelected(store.getState(), item2)).toBe(false)
    expect(isSelectionBarVisible(store.getState())).toBe(true)

    // reselecting the same item does nothing
    store.dispatch(toggleItemSelection(item1, false))
    expect(isSelected(store.getState(), item1)).toBe(true)

    // selecting a second item
    store.dispatch(toggleItemSelection(item2, false))
    expect(isSelected(store.getState(), item1)).toBe(true)
    expect(isSelected(store.getState(), item2)).toBe(true)
    expect(isSelectionBarVisible(store.getState())).toBe(true)

    // deselecting the first item
    store.dispatch(toggleItemSelection(item1, true))
    expect(isSelected(store.getState(), item1)).toBe(false)
    expect(isSelected(store.getState(), item2)).toBe(true)
    expect(isSelectionBarVisible(store.getState())).toBe(true)

    // deselecting the same item again does nothing
    store.dispatch(toggleItemSelection(item1, true))
    expect(isSelected(store.getState(), item1)).toBe(false)

    // deselecting the second item
    store.dispatch(toggleItemSelection(item2, true))
    expect(isSelected(store.getState(), item1)).toBe(false)
    expect(isSelected(store.getState(), item2)).toBe(false)
    expect(isSelectionBarVisible(store.getState())).toBe(false)
  })

  it('returns the list of items', () => {
    const store = setup()

    store.dispatch(toggleItemSelection(item1, false))
    store.dispatch(toggleItemSelection(item2, false))

    const selection = getSelectedFiles(store.getState())
    expect(selection).toEqual(expect.arrayContaining([item2, item2]))
  })
})
