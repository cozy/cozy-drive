import React from 'react'
import { render } from '@testing-library/react'

import { createMockClient } from 'cozy-client'
import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'

import AppLike from 'test/components/AppLike'
import { officeDocParam } from 'test/data'

import Editor from './Editor'

jest.mock('cozy-client/dist/hooks/useFetchJSON', () => ({
  __esModule: true,
  default: jest.fn(),
  useFetchJSON: jest.fn()
}))

const client = createMockClient({})

const setup = () => {
  const root = render(
    <AppLike client={client}>
      <Editor fileId="123" />
    </AppLike>
  )

  return { root }
}

describe('Editor', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should not show the toolbar but a spinner if the doc is not loaded', () => {
    useFetchJSON.mockReturnValue({ fetchStatus: 'loading', data: undefined })

    const { root } = setup()
    const { queryByRole, queryByTestId } = root

    expect(queryByRole('progressbar')).toBeTruthy()
    expect(queryByTestId('onlyoffice-toolbar')).toBeFalsy()
  })

  it('should show the toolbar and an error if the doc is undefined', () => {
    useFetchJSON.mockReturnValue({ fetchStatus: 'error', data: undefined })

    const { root } = setup()
    const { queryByRole, queryByTestId, getByText } = root

    expect(queryByRole('progressbar')).toBeFalsy()
    expect(queryByTestId('onlyoffice-toolbar')).toBeTruthy()
    expect(getByText('Something goes wrong')).toBeTruthy()
  })

  it('should show the toolbar and the container view if the doc is undefined', () => {
    useFetchJSON.mockReturnValue({
      fetchStatus: 'loaded',
      data: officeDocParam
    })

    const { root } = setup()
    const { container, queryByRole, queryByTestId } = root

    expect(queryByRole('progressbar')).toBeFalsy()
    expect(queryByTestId('onlyoffice-toolbar')).toBeTruthy()
    expect(container.querySelector('#onlyOfficeEditor')).toBeTruthy()
  })
})
