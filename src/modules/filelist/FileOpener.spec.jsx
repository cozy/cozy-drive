import React from 'react'
import { render } from '@testing-library/react'

import { createMockClient } from 'cozy-client'

import { shouldBeOpenedByOnlyOffice } from 'cozy-client/dist/models/file'

import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'

import FileOpener, { getParentLink } from './FileOpener'

jest.mock('cozy-client/dist/models/file', () => ({
  ...jest.requireActual('cozy-client/dist/models/file'),
  shouldBeOpenedByOnlyOffice: jest.fn()
}))

const client = createMockClient({})
const file = generateFile({ i: 0 })

const setup = ({ file }) => {
  const root = render(
    <AppLike client={client}>
      <FileOpener file={file} />
    </AppLike>
  )

  return { root }
}

describe('FileOpener', () => {
  it('should show a link to onlyoffice document if Only Office is supported', () => {
    shouldBeOpenedByOnlyOffice.mockReturnValue(true)

    const { root } = setup({ file })
    const { queryByTestId } = root

    expect(queryByTestId('onlyoffice-link')).toBeTruthy()
    expect(queryByTestId('not-onlyoffice-span')).toBeFalsy()
  })

  it('should show a regular span if Only Office is not supported', () => {
    shouldBeOpenedByOnlyOffice.mockReturnValue(false)

    const { root } = setup({ file })
    const { queryByTestId } = root

    expect(queryByTestId('onlyoffice-link')).toBeFalsy()
    expect(queryByTestId('not-onlyoffice-span')).toBeTruthy()
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
