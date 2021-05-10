import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { createMockClient, useQuery } from 'cozy-client'

import AppLike from 'test/components/AppLike'
import { officeDocParam } from 'test/data'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import Toolbar from 'drive/web/modules/views/OnlyOffice/Toolbar'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

const client = createMockClient({})

const setup = ({ isReadOnly = false } = {}) => {
  const root = render(
    <AppLike client={client}>
      <OnlyOfficeContext.Provider
        value={{
          fileId: '123',
          isPublic: 'false',
          isReadOnly,
          setIsReadOnly: jest.fn()
        }}
      >
        <Toolbar />
      </OnlyOfficeContext.Provider>
    </AppLike>
  )

  return { root }
}

describe('Toolbar', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be able to rename the file if not in readOnly mode', () => {
    useQuery.mockReturnValue(officeDocParam)

    const { root } = setup({ isReadOnly: false })
    const { getByText, getByRole } = root

    fireEvent.click(getByText(officeDocParam.data.name))
    expect(getByRole('textbox').value).toBe(officeDocParam.data.name)
  })

  it('should not be able to rename the file in readOnly mode', () => {
    useQuery.mockReturnValue(officeDocParam)

    const { root } = setup({ isReadOnly: true })
    const { getByText, queryByRole } = root

    fireEvent.click(getByText(officeDocParam.data.name))
    expect(queryByRole('textbox')).toBeFalsy()
  })
})
