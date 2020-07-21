import { generateFile } from 'test/generate'
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

  const item1 = generateFile({ i: 1 })
  const item2 = generateFile({ i: 2 })

  const itemIsSelected = true
  const itemIsNotSelected = false

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
    store.dispatch(toggleItemSelection(item1, itemIsNotSelected))
    expect(isSelected(store.getState(), item1)).toBe(true)
    expect(isSelected(store.getState(), item2)).toBe(false)
    expect(isSelectionBarVisible(store.getState())).toBe(true)

    // reselecting the same item keeps it selected
    store.dispatch(toggleItemSelection(item1, itemIsNotSelected))
    expect(isSelected(store.getState(), item1)).toBe(true)

    // selecting a second item
    store.dispatch(toggleItemSelection(item2, itemIsNotSelected))
    expect(isSelected(store.getState(), item1)).toBe(true)
    expect(isSelected(store.getState(), item2)).toBe(true)
    expect(isSelectionBarVisible(store.getState())).toBe(true)

    // deselecting the first item
    store.dispatch(toggleItemSelection(item1, itemIsSelected))
    expect(isSelected(store.getState(), item1)).toBe(false)
    expect(isSelected(store.getState(), item2)).toBe(true)
    expect(isSelectionBarVisible(store.getState())).toBe(true)

    // deselecting the same item keepts it deselected
    store.dispatch(toggleItemSelection(item1, itemIsSelected))
    expect(isSelected(store.getState(), item1)).toBe(false)

    // deselecting the second item
    store.dispatch(toggleItemSelection(item2, itemIsSelected))
    expect(isSelected(store.getState(), item1)).toBe(false)
    expect(isSelected(store.getState(), item2)).toBe(false)
    expect(isSelectionBarVisible(store.getState())).toBe(false)
  })

  it('returns the list of items', () => {
    const store = setup()

    store.dispatch(toggleItemSelection(item1, itemIsNotSelected))
    store.dispatch(toggleItemSelection(item2, itemIsNotSelected))

    const selection = getSelectedFiles(store.getState())
    expect(selection).toEqual(expect.arrayContaining([item2, item2]))
  })
})
