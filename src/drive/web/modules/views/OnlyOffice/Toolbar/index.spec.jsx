import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { createMockClient, useQuery } from 'cozy-client'

import AppLike from 'test/components/AppLike'
import { officeDocParam } from 'test/data'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import Toolbar from 'drive/web/modules/views/OnlyOffice/Toolbar'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

const client = createMockClient({})

const setup = ({
  isReadOnly = false,
  pathname = '/onlyoffice/fileId'
} = {}) => {
  const root = render(
    <AppLike
      client={client}
      routerContextValue={{
        router: { location: { pathname } },
        history: jest.fn()
      }}
      sharingContextValue={{
        byDocId: { '123': {} },
        documentType: 'Files'
      }}
    >
      <OnlyOfficeContext.Provider
        value={{
          fileId: officeDocParam.id,
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

  describe('Renaming', () => {
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

  describe('Back Button', () => {
    describe('with default history', () => {
      it('should not show the back button', () => {
        useQuery.mockReturnValue(officeDocParam)

        const { root } = setup()
        const { queryByTestId } = root

        expect(window.history.length).toBe(1)
        expect(queryByTestId('onlyoffice-backButton')).toBeFalsy()
      })

      it('should not show the back button in sharing from cozy to cozy', () => {
        useQuery.mockReturnValue(officeDocParam)

        const { root } = setup({ pathname: '/onlyoffice/fileId/fromSharing' })
        const { queryByTestId } = root

        expect(window.history.length).toBe(1)
        expect(queryByTestId('onlyoffice-backButton')).toBeFalsy()
      })
    })

    describe('with 1 more entry in history', () => {
      beforeAll(() => {
        window.history.pushState('data', 'title', 'url')
      })

      it('should show the back button', () => {
        useQuery.mockReturnValue(officeDocParam)

        const { root } = setup()
        const { queryByTestId } = root

        expect(window.history.length).toBe(2)
        expect(queryByTestId('onlyoffice-backButton')).toBeTruthy()
      })

      it('should not show the back button in sharing from cozy to cozy', () => {
        useQuery.mockReturnValue(officeDocParam)

        const { root } = setup({ pathname: '/onlyoffice/fileId/fromSharing' })
        const { queryByTestId } = root

        expect(window.history.length).toBe(2)
        expect(queryByTestId('onlyoffice-backButton')).toBeFalsy()
      })
    })

    describe('with 2 more entries in history', () => {
      beforeAll(() => {
        window.history.pushState('data', 'title', 'url')
      })

      it('should show the back button', () => {
        useQuery.mockReturnValue(officeDocParam)

        const { root } = setup()
        const { queryByTestId } = root

        expect(window.history.length).toBe(3)
        expect(queryByTestId('onlyoffice-backButton')).toBeTruthy()
      })

      it('should show the back button in sharing from cozy to cozy', () => {
        useQuery.mockReturnValue(officeDocParam)

        const { root } = setup({ pathname: '/onlyoffice/fileId/fromSharing' })
        const { queryByTestId } = root

        expect(window.history.length).toBe(3)
        expect(queryByTestId('onlyoffice-backButton')).toBeTruthy()
      })
    })
  })
})
