import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { generateFile } from 'test/generate'
import {
  SelectionProvider,
  useSelectionContext
} from 'modules/selection/SelectionProvider'
import {
  MemoryRouter,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom'

const SelectionConsumer = ({ items }) => {
  const {
    showSelectionBar,
    hideSelectionBar,
    isSelectionBarVisible,
    toggleSelectedItem,
    isItemSelected
  } = useSelectionContext()
  const { pathname } = useLocation()

  return (
    <>
      {pathname === '/' && <Link to={'/other'}>Change route</Link>}
      {isSelectionBarVisible && (
        <button onClick={hideSelectionBar}>Hide selection bar</button>
      )}
      {items.map(item => (
        <button onClick={() => toggleSelectedItem(item)} key={item.id}>
          {`Item ${item.id} ${isItemSelected(item.id) ? 'selected' : ''}`}
        </button>
      ))}
      <button onClick={showSelectionBar}>Show selection bar</button>
    </>
  )
}

describe('SelectionProvider', () => {
  const item1 = generateFile({ i: 1 })
  const item2 = generateFile({ i: 2 })

  const setup = () => {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <SelectionProvider>
          <Routes>
            <Route
              path="/"
              element={<SelectionConsumer items={[item1, item2]} />}
            />
            <Route
              path="/other"
              element={<SelectionConsumer items={[item1, item2]} />}
            />
          </Routes>
        </SelectionProvider>
      </MemoryRouter>
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
})
