import { render, screen } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import FileOpener from './FileOpener'
import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'

import { useFileLink } from '@/modules/navigation/hooks/useFileLink'

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
