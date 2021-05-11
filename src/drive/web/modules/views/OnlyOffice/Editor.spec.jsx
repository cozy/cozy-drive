import React from 'react'
import { render } from '@testing-library/react'

import { createMockClient } from 'cozy-client'
import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'

import AppLike from 'test/components/AppLike'
import { officeDocParam } from 'test/data'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import Editor from 'drive/web/modules/views/OnlyOffice/Editor'

jest.mock('cozy-client/dist/hooks/useFetchJSON', () => ({
  __esModule: true,
  default: jest.fn(),
  useFetchJSON: jest.fn()
}))

const client = createMockClient({})

const setup = () => {
  const root = render(
    <AppLike client={client}>
      <OnlyOfficeContext.Provider
        value={{
          fileId: '123',
          isPublic: 'false',
          isReadOnly: false,
          setIsReadOnly: jest.fn()
        }}
      >
        <Editor />
      </OnlyOfficeContext.Provider>
    </AppLike>
  )

  return { root }
}

describe('Editor', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should not show the title but a spinner if the doc is not loaded', () => {
    useFetchJSON.mockReturnValue({ fetchStatus: 'loading', data: undefined })

    const { root } = setup()
    const { queryByTestId } = root

    expect(queryByTestId('onlyoffice-content-spinner')).toBeTruthy()
    expect(queryByTestId('onlyoffice-title')).toBeFalsy()
  })

  it('should show the title and an error if the doc is undefined', () => {
    useFetchJSON.mockReturnValue({ fetchStatus: 'error', data: undefined })

    const { root } = setup()
    const { queryByTestId, getByText } = root

    expect(queryByTestId('onlyoffice-content-spinner')).toBeFalsy()
    expect(queryByTestId('onlyoffice-title')).toBeTruthy()
    expect(getByText('Something goes wrong')).toBeTruthy()
  })

  it('should show the title and the container view', () => {
    useFetchJSON.mockReturnValue({
      fetchStatus: 'loaded',
      data: officeDocParam
    })

    const { root } = setup()
    const { container, queryByTestId } = root

    expect(queryByTestId('onlyoffice-content-spinner')).toBeFalsy()
    expect(queryByTestId('onlyoffice-title')).toBeTruthy()
    expect(container.querySelector('#onlyOfficeEditor')).toBeTruthy()
  })
})
