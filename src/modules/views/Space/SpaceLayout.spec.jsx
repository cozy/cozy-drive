import { act, render, screen } from '@testing-library/react'
import React from 'react'
import {
  HashRouter,
  MemoryRouter,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'

import { useQuery } from 'cozy-client'

import {
  SpaceRootRedirect,
  reportSpaceFiles,
  useTwakeSpace
} from './SpaceLayout'

import { ROUTER_FUTURE_FLAGS } from '@/constants/config'

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  useQuery: jest.fn()
}))
jest.mock('@/modules/views/Folder/FolderView', () => ({
  __esModule: true,
  default: ({ isNotFound }) => (
    <div data-testid={isNotFound ? 'not-found' : 'loading'} />
  )
}))

const HOST = 'https://space.test'

const Shown = () => {
  useTwakeSpace()
  const { pathname } = useLocation()
  return <div data-testid="pathname">{pathname}</div>
}

const fromHost = (parent, data) =>
  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', { data, origin: HOST, source: parent })
    )
  })

describe('useTwakeSpace', () => {
  let parent

  beforeEach(() => {
    parent = { postMessage: jest.fn() }
    Object.defineProperty(window, 'parent', {
      value: parent,
      configurable: true
    })
    window.history.replaceState(null, '', '/#/embed/sharings/d1/f1')
  })

  afterEach(() => {
    Object.defineProperty(window, 'parent', {
      value: window,
      configurable: true
    })
  })

  const setup = () =>
    render(
      <HashRouter future={ROUTER_FUTURE_FLAGS}>
        <Routes>
          <Route path="embed/sharings/:driveId/:folderId" element={<Shown />} />
        </Routes>
      </HashRouter>
    )

  it('reports the shown drive to TwakeSpace and shows the one it loads', () => {
    const { unmount } = setup()

    fromHost(parent, { type: 'twake-embed:hello' })
    expect(parent.postMessage).toHaveBeenCalledWith(
      {
        type: 'twake-embed:path',
        resourceId: 'd1',
        path: '/f1',
        replace: true
      },
      HOST
    )

    fromHost(parent, {
      type: 'twake-embed:load',
      resourceId: 'd2',
      path: '/f9'
    })
    expect(screen.getByTestId('pathname').textContent).toBe(
      '/embed/sharings/d2/f9'
    )

    unmount()
    expect(Object.hasOwn(window.history, 'pushState')).toBe(false)
  })

  it('reports the files of every shared drive shown, when they change', () => {
    const metadata = () =>
      parent.postMessage.mock.calls
        .map(([data]) => data)
        .filter(data => data.type === 'twake-embed:metadata')
        .map(data => data.metadata)

    const { unmount } = setup()
    fromHost(parent, { type: 'twake-embed:hello' })

    reportSpaceFiles('d1', 3)
    reportSpaceFiles('d1', 3)
    expect(metadata()).toEqual([
      [{ resourceId: 'd1', name: 'files.count', value: 3 }]
    ])

    reportSpaceFiles('d2', 5)
    expect(metadata()).toHaveLength(2)
    expect(metadata()[1]).toEqual([
      { resourceId: 'd1', name: 'files.count', value: 3 },
      { resourceId: 'd2', name: 'files.count', value: 5 }
    ])

    unmount()
    parent.postMessage.mockClear()
    setup()
    expect(metadata()).toEqual([])
    fromHost(parent, { type: 'twake-embed:hello' })
    expect(metadata()).toHaveLength(1)
    expect(metadata()[0]).toHaveLength(2)
  })
})

describe('SpaceRootRedirect', () => {
  it('shows the drive as not found when it cannot be fetched', () => {
    useQuery.mockReturnValue({ fetchStatus: 'failed', data: null })

    render(
      <MemoryRouter
        initialEntries={['/embed/sharings/unknown']}
        future={ROUTER_FUTURE_FLAGS}
      >
        <Routes>
          <Route
            path="embed/sharings/:driveId"
            element={<SpaceRootRedirect />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })
})
