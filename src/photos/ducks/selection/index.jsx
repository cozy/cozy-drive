import React, { Component } from 'react'
import SelectionBar from 'cozy-ui/transpiled/react/SelectionBar'

const SelectionContext = React.createContext([])

// constants
const SELECT_ITEM = 'SELECT_ITEM'
const UNSELECT_ITEM = 'UNSELECT_ITEM'
const ADD_TO_SELECTION = 'ADD_TO_SELECTION'
const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION'
const TOGGLE_SELECTION_BAR = 'TOGGLE_SELECTION_BAR'
const SHOW_SELECTION_BAR = 'SHOW_SELECTION_BAR'
const HIDE_SELECTION_BAR = 'HIDE_SELECTION_BAR'

// actions
const showSelectionBar = () => ({ type: SHOW_SELECTION_BAR })
const hideSelectionBar = () => ({ type: HIDE_SELECTION_BAR })
// const toggleSelectionBar = () => ({ type: TOGGLE_SELECTION_BAR })
const toggleItemSelection = (item, selected) => ({
  type: selected ? UNSELECT_ITEM : SELECT_ITEM,
  item
})
const addToSelection = items => ({ type: ADD_TO_SELECTION, items })
const removeFromSelection = items => ({
  type: REMOVE_FROM_SELECTION,
  items
})

// reducers
const selected = (state = [], action) => {
  if (action.meta && action.meta.cancelSelection) {
    return []
  }
  switch (action.type) {
    case SELECT_ITEM:
      return [...state, action.item]
    case UNSELECT_ITEM:
      return state.filter(i => i._id !== action.item.id)
    case ADD_TO_SELECTION:
      // eslint-disable-next-line no-case-declarations
      const selectedIds = state.map(i => i._id)
      // eslint-disable-next-line no-case-declarations
      const newItems = action.items.filter(
        i => selectedIds.indexOf(i._id) === -1
      )
      return [...state, ...newItems]
    case REMOVE_FROM_SELECTION:
      // eslint-disable-next-line no-case-declarations
      const itemIds = action.items.map(i => i._id)
      return state.filter(i => itemIds.indexOf(i._id) === -1)
    case HIDE_SELECTION_BAR:
      return []
    default:
      return state
  }
}

const isSelectionBarOpened = (state = false, action) => {
  if (action.meta && action.meta.cancelSelection) {
    return false
  }
  switch (action.type) {
    case TOGGLE_SELECTION_BAR:
      return !state
    case SHOW_SELECTION_BAR:
      return true
    case HIDE_SELECTION_BAR:
      return false
    default:
      return state
  }
}

export default class Selection extends Component {
  state = {
    selected: selected(undefined, {}),
    opened: isSelectionBarOpened(undefined, {})
  }

  toggle = (id, selected) => this.dispatch(toggleItemSelection(id, selected))
  select = ids => this.dispatch(addToSelection(ids))
  unselect = ids => this.dispatch(removeFromSelection(ids))
  clear = () => this.dispatch(hideSelectionBar())
  show = () => this.dispatch(showSelectionBar())

  dispatch(action) {
    this.setState(state => ({
      ...state,
      selected: selected(state.selected, action),
      opened: isSelectionBarOpened(state.opened, action)
    }))
  }

  render() {
    const { children, actions = {} } = this.props
    const { selected, opened } = this.state

    const active = selected.length !== 0 || opened

    const selectionActions = {
      toggle: this.toggle,
      select: this.select,
      unselect: this.unselect,
      clear: this.clear,
      show: this.show
    }

    const realActions =
      typeof actions === 'function' ? actions(selectionActions) : actions

    let checkedActions = {}
    Object.keys(realActions).map(k => {
      checkedActions[k] =
        typeof realActions[k] === 'function'
          ? { action: realActions[k] }
          : realActions[k]
    })

    const hasActions = Object.keys(checkedActions).length > 0

    return (
      <SelectionContext.Provider value={selected}>
        <div>
          {active && hasActions && (
            <SelectionBar
              selected={selected}
              hideSelectionBar={this.clear}
              actions={checkedActions}
            />
          )}
          {children(selected, active, selectionActions)}
        </div>
      </SelectionContext.Provider>
    )
  }
}

export const Consumer = SelectionContext.Consumer
