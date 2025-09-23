import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import {
  MemoryRouter,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom'

import { generateFile } from 'test/generate'

import {
  SelectionProvider,
  useSelectionContext
} from '@/modules/selection/SelectionProvider'

// Create a mock store for testing
const mockStore = createStore(() => ({
  // Add any state that SelectionProvider needs
  upload: {
    queue: [],
    newItems: []
  }
  // Add other state slices if needed
}))

const SelectionConsumer = ({ items }) => {
  const {
    showSelectionBar,
    hideSelectionBar,
    isSelectionBarVisible,
    toggleSelectedItem,
    isItemSelected,
    handleShiftClick,
    handleShiftArrow,
    focusedIndex,
    setItemsList
  } = useSelectionContext()
  const { pathname } = useLocation()

  React.useEffect(() => {
    setItemsList(items)
  }, [items, setItemsList])

  return (
    <>
      {pathname === '/' && <Link to="/other">Change route</Link>}
      {isSelectionBarVisible && (
        <button onClick={hideSelectionBar}>Hide selection bar</button>
      )}
      {items.map((item, index) => (
        <button
          onClick={() => toggleSelectedItem(item, index)}
          key={item.id}
          data-testid={`item-${index + 1}`}
        >
          {`Item ${item.id} ${isItemSelected(item.id) ? 'selected' : ''}`}
        </button>
      ))}
      <button onClick={showSelectionBar}>Show selection bar</button>

      <button
        onClick={() => handleShiftClick(items[2], 2)}
        data-testid="shift-click"
      >
        Shift + Click
      </button>
      <button
        onClick={() => handleShiftArrow(1, items)}
        data-testid="shift-arrow-down"
      >
        Shift + Arrow Down
      </button>
      <button
        onClick={() => handleShiftArrow(-1, items)}
        data-testid="shift-arrow-up"
      >
        Shift + Arrow Up
      </button>
      <div data-testid="focused-index">{focusedIndex}</div>
    </>
  )
}

describe('SelectionProvider', () => {
  const item1 = generateFile({ i: 1 })
  const item2 = generateFile({ i: 2 })
  const item3 = generateFile({ i: 3 })
  const items = [item1, item2, item3]

  const setup = () => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/']}>
          <SelectionProvider>
            <Routes>
              <Route path="/" element={<SelectionConsumer items={items} />} />
              <Route
                path="/other"
                element={<SelectionConsumer items={items} />}
              />
            </Routes>
          </SelectionProvider>
        </MemoryRouter>
      </Provider>
    )
  }

  it('show and hide the selection bar', async () => {
    setup()

    expect(screen.queryByText('Hide selection bar')).toBeNull()

    fireEvent.click(screen.getByText('Show selection bar'))
    await waitFor(async () => {
      const hideButton = await screen.findByText('Hide selection bar')
      expect(hideButton).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Hide selection bar'))
    expect(screen.queryByText('Hide selection bar')).toBeNull()
  })

  it('select and deselects item', () => {
    setup()

    // selecting one item
    fireEvent.click(screen.getByText('Item file-foobar1'))
    expect(screen.getByText('Item file-foobar1 selected')).toBeInTheDocument()
    expect(screen.getByText('Item file-foobar2')).toBeInTheDocument()
    expect(screen.getByText('Hide selection bar')).toBeInTheDocument()

    // selecting a second item
    fireEvent.click(screen.getByText('Item file-foobar2'))
    expect(screen.getByText('Item file-foobar1 selected')).toBeInTheDocument()
    expect(screen.getByText('Item file-foobar2 selected')).toBeInTheDocument()
    expect(screen.getByText('Hide selection bar')).toBeInTheDocument()

    // deselecting the first item
    fireEvent.click(screen.getByText('Item file-foobar1 selected'))
    expect(screen.getByText('Item file-foobar1')).toBeInTheDocument()
    expect(screen.getByText('Item file-foobar2 selected')).toBeInTheDocument()
    expect(screen.getByText('Hide selection bar')).toBeInTheDocument()

    // deselecting the second item
    fireEvent.click(screen.getByText('Item file-foobar2 selected'))
    expect(screen.getByText('Item file-foobar1')).toBeInTheDocument()
    expect(screen.getByText('Item file-foobar2')).toBeInTheDocument()
    expect(screen.queryByText('Hide selection bar')).toBeNull()
  })

  it('should deselects items when location changed', async () => {
    setup()

    // show selection bar
    fireEvent.click(screen.getByText('Show selection bar'))
    const hideButton = await screen.findByText('Hide selection bar')
    expect(hideButton).toBeInTheDocument()

    // selecting all items
    fireEvent.click(screen.getByText('Item file-foobar1'))
    fireEvent.click(screen.getByText('Item file-foobar2'))
    expect(screen.getByText('Item file-foobar1 selected')).toBeInTheDocument()
    expect(screen.getByText('Item file-foobar2 selected')).toBeInTheDocument()
    expect(screen.getByText('Hide selection bar')).toBeInTheDocument()

    // change route
    fireEvent.click(screen.getByText('Change route'))

    // hide selection bar and selecting all items
    await waitFor(async () => {
      expect(await screen.findByText('Item file-foobar1')).toBeInTheDocument()
      expect(await screen.findByText('Item file-foobar2')).toBeInTheDocument()
      expect(screen.queryByText('Hide selection bar')).toBeNull()
    })
  })

  it('selects a range of items with handleShiftClick', () => {
    setup()

    fireEvent.click(screen.getByTestId('item-1'))
    expect(screen.getByText('Item file-foobar1 selected')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('shift-click'))
    expect(screen.getByText('Item file-foobar1 selected')).toBeInTheDocument()
    expect(screen.getByText('Item file-foobar2 selected')).toBeInTheDocument()
    expect(screen.getByText('Item file-foobar3 selected')).toBeInTheDocument()

    // shift-click again should toggle/deselect item3
    fireEvent.click(screen.getByTestId('shift-click'))

    expect(screen.getByText('Item file-foobar1 selected')).toBeInTheDocument()
    expect(screen.getByText('Item file-foobar2 selected')).toBeInTheDocument()
    // item3 should now be unselected
    expect(screen.getByTestId('item-3')).toHaveTextContent('Item file-foobar3')
  })

  it('selects range with handleShiftArrow', () => {
    setup()

    fireEvent.click(screen.getByTestId('item-1'))
    expect(screen.getByText('Item file-foobar1 selected')).toBeInTheDocument()

    // Shift + ArrowDown => should extend to item2
    fireEvent.click(screen.getByTestId('shift-arrow-down'))
    expect(screen.getByText('Item file-foobar1 selected')).toBeInTheDocument()
    expect(screen.getByText('Item file-foobar2 selected')).toBeInTheDocument()

    // Shift + ArrowDown again => should extend to item3
    fireEvent.click(screen.getByTestId('shift-arrow-down'))
    expect(screen.getByText('Item file-foobar3 selected')).toBeInTheDocument()

    // Shift + ArrowUp => shrink back, item3 deselected
    fireEvent.click(screen.getByTestId('shift-arrow-up'))
    expect(screen.getByText('Item file-foobar3')).toBeInTheDocument()
  })
})
