import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { createMockClient, useQuery } from 'cozy-client'

import AppLike from 'test/components/AppLike'
import { officeDocParam } from 'test/data'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import Toolbar from 'drive/web/modules/views/OnlyOffice/Toolbar'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('drive/web/modules/views/OnlyOffice/Toolbar/helpers', () => ({
  ...jest.requireActual('drive/web/modules/views/OnlyOffice/Toolbar/helpers'),
  computeHomeApp: jest.fn(() => ({}))
}))

const client = createMockClient({})
client.stackClient.uri = 'http://cozy.tools'

const setup = ({
  isEditorReadOnly = false,
  pathname = '/onlyoffice/fileId',
  isPublic = false
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
          isPublic,
          isEditorReadOnly,
          setIsEditorReadOnly: jest.fn(),
          isEditorReady: true
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

      const { root } = setup({ isEditorReadOnly: false })
      const { getByText, getByRole } = root

      fireEvent.click(getByText(officeDocParam.data.name))
      expect(getByRole('textbox').value).toBe(officeDocParam.data.name)
    })

    it('should not be able to rename the file in readOnly mode', () => {
      useQuery.mockReturnValue(officeDocParam)

      const { root } = setup({ isEditorReadOnly: true })
      const { getByText, queryByRole } = root

      fireEvent.click(getByText(officeDocParam.data.name))
      expect(queryByRole('textbox')).toBeFalsy()
    })
  })

  describe('Sharing', () => {
    it('should show sharing button in not public views', () => {
      useQuery.mockReturnValue(officeDocParam)

      const { root } = setup({ isPublic: false })
      const { queryByTestId } = root

      expect(queryByTestId('onlyoffice-sharing-button')).toBeTruthy()
    })

    it('should not show sharing button in public views', () => {
      useQuery.mockReturnValue(officeDocParam)

      const { root } = setup({ isPublic: true })
      const { queryByTestId } = root

      expect(queryByTestId('onlyoffice-sharing-button')).toBeFalsy()
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
