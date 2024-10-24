import { render, screen } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import FileOpener, { getParentLink, handlePress } from './FileOpener'
import { useFileLink } from 'modules/navigation/hooks/useFileLink'
import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'

jest.mock('cozy-client/dist/models/file', () => ({
  ...jest.requireActual('cozy-client/dist/models/file'),
  shouldBeOpenedByOnlyOffice: jest.fn()
}))

jest.mock('modules/navigation/hooks/useFileLink', () => ({
  useFileLink: jest.fn()
}))

describe('FileOpener component', () => {
  const client = createMockClient({})
  const file = generateFile({ i: 1 })

  const setup = ({ file, linkApp = 'drive' }) => {
    useFileLink.mockReturnValue({
      link: {
        app: linkApp,
        to: '/path/to/file',
        href: 'http://cozy.tools:8080/files/123'
      }
    })

    render(
      <AppLike client={client}>
        <FileOpener file={file}>{file.name}</FileOpener>
      </AppLike>
    )
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders a Link when link.app is drive', async () => {
    setup({ file, linkApp: 'drive' })
    const linkElement = await screen.findByText(file.name)
    expect(linkElement).toBeInTheDocument()
    expect(linkElement.getAttribute('href')).toBe('#/path/to/file')
  })

  it('renders an anchor when link.app is not drive', async () => {
    setup({ file, linkApp: 'other-app' })
    const anchorElement = await screen.findByText(file.name)
    expect(anchorElement).toBeInTheDocument()
    expect(anchorElement.getAttribute('href')).toBe(
      'http://cozy.tools:8080/files/123'
    )
  })
})

describe('handlePress function', () => {
  const mockToggle = jest.fn()
  const mockOpenLink = jest.fn()
  const mockPreventDefault = jest.fn()
  const mockStopImmediatePropagation = jest.fn()

  const ev = {
    srcEvent: { stopImmediatePropagation: mockStopImmediatePropagation },
    preventDefault: mockPreventDefault,
    type: 'press'
  }

  const setupTest = ({
    actionMenuVisible = false,
    disabled = false,
    enableTouchEvents = jest.fn(() => true),
    selectionModeActive = false,
    isRenaming = false
  }) => {
    return {
      params: {
        actionMenuVisible,
        disabled,
        enableTouchEvents,
        selectionModeActive,
        isRenaming,
        openLink: mockOpenLink,
        toggle: mockToggle
      }
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should not trigger any action if actionMenuVisible or disabled', () => {
    const { params } = setupTest({ actionMenuVisible: true })
    handlePress(ev, params)
    expect(mockToggle).not.toHaveBeenCalled()
    expect(mockOpenLink).not.toHaveBeenCalled()
    expect(mockPreventDefault).not.toHaveBeenCalled()
    expect(mockStopImmediatePropagation).not.toHaveBeenCalled()
  })

  it('should toggle if event type is press or selectionModeActive', () => {
    const { params } = setupTest({ selectionModeActive: true })
    handlePress(ev, params)
    expect(mockPreventDefault).toHaveBeenCalled()
    expect(mockStopImmediatePropagation).toHaveBeenCalled()
    expect(mockToggle).toHaveBeenCalledWith(ev)
  })

  it('should open link if not renaming and event type is tap', () => {
    const { params } = setupTest({ isRenaming: false })
    ev.type = 'tap'
    handlePress(ev, params)
    expect(mockPreventDefault).toHaveBeenCalled()
    expect(mockStopImmediatePropagation).toHaveBeenCalled()
    expect(mockOpenLink).toHaveBeenCalledWith(ev.srcEvent)
  })

  it('should not open link if isRenaming', () => {
    const { params } = setupTest({ isRenaming: true })
    ev.type = 'tap'
    handlePress(ev, params)
    expect(mockOpenLink).not.toHaveBeenCalled()
  })

  it('should not trigger actions if enableTouchEvents returns false', () => {
    const enableTouchEvents = jest.fn(() => false)
    const { params } = setupTest({ enableTouchEvents })
    handlePress(ev, params)
    expect(mockPreventDefault).not.toHaveBeenCalled()
    expect(mockStopImmediatePropagation).not.toHaveBeenCalled()
    expect(mockToggle).not.toHaveBeenCalled()
    expect(mockOpenLink).not.toHaveBeenCalled()
  })
})

describe('getParentLink function', () => {
  it('should return the first link in the element ancestors', () => {
    const div = document.createElement('div')
    const link = document.createElement('a')
    link.className = 'my-link'
    const span = document.createElement('span')
    const span2 = document.createElement('span')
    div.appendChild(link)
    link.appendChild(span)
    span.appendChild(span2)
    const result = getParentLink(span2)
    expect(result).toEqual(link)
  })

  it('should return null if there is no link in the element ancestors', () => {
    const div = document.createElement('div')
    const span = document.createElement('span')
    div.appendChild(span)
    const result = getParentLink(span)
    expect(result).toBeNull()
  })
})
