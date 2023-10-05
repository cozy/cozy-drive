import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'

import { createMockClient, useQuery } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import AppLike from 'test/components/AppLike'
import { officeDocParam } from 'test/data'

import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import Toolbar from 'drive/web/modules/views/OnlyOffice/Toolbar'

jest.mock('cozy-ui/transpiled/react/providers/Breakpoints', () => ({
  ...jest.requireActual('cozy-ui/transpiled/react/providers/Breakpoints'),
  __esModule: true,
  default: jest.fn(),
  useBreakpoints: jest.fn()
}))
jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('drive/web/modules/views/OnlyOffice/Toolbar/helpers', () => ({
  ...jest.requireActual('drive/web/modules/views/OnlyOffice/Toolbar/helpers'),
  computeHomeApp: jest.fn(() => ({ slug: 'slug' }))
}))

const client = createMockClient({})
client.stackClient.uri = 'http://cozy.tools'
client.plugins = {
  realtime: {
    subscribe: () => {},
    unsubscribe: () => {}
  }
}
client.collection = () => ({
  fetchOwnPermissions: () =>
    Promise.resolve({
      included: []
    })
})

const setup = ({
  isReadOnly = false,
  isPublic = false,
  isFromSharing = false,
  isMobile = false
} = {}) => {
  useBreakpoints.mockReturnValue({ isMobile })

  const root = render(
    <AppLike
      client={client}
      sharingContextValue={{
        byDocId: { 123: {} },
        documentType: 'Files'
      }}
    >
      <OnlyOfficeContext.Provider
        value={{
          fileId: officeDocParam.id,
          isPublic,
          isFromSharing,
          isReadOnly,
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
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation()
  })

  describe('FileName', () => {
    it('should show the path', () => {
      // TODO : analyse why BaseButton has incorrect props and remove this consoleSpy
      jest.spyOn(console, 'error').mockImplementation()

      useQuery
        .mockReturnValueOnce(officeDocParam)
        .mockReturnValue({ ...officeDocParam, data: { path: '/path' } })

      const { root } = setup({ isMobile: false })
      const { queryByTestId } = root

      expect(queryByTestId('onlyoffice-filename-path')).toBeTruthy()
    })

    it('should not show the path on mobile', () => {
      useQuery
        .mockReturnValueOnce(officeDocParam)
        .mockReturnValue({ ...officeDocParam, data: { path: '/path' } })

      const { root } = setup({ isMobile: true })
      const { queryByTestId } = root

      expect(queryByTestId('onlyoffice-filename-path')).toBeFalsy()
    })
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

    describe('Renaming on mobile', () => {
      it('should be able to rename the file if not in readOnly mode', () => {
        useQuery.mockReturnValue(officeDocParam)

        const { root } = setup({ isReadOnly: false, isMobile: true })
        const { getByText, getByRole } = root

        fireEvent.click(getByText(officeDocParam.data.name))
        expect(getByRole('textbox').value).toBe(officeDocParam.data.name)
      })
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

    describe('Sharing on mobile', () => {
      it('should show only sharing icon on mobile', () => {
        useQuery.mockReturnValue(officeDocParam)

        const { root } = setup({ isPublic: false, isMobile: true })
        const { queryByTestId } = root

        expect(queryByTestId('onlyoffice-sharing-button')).toBeFalsy()
        expect(queryByTestId('onlyoffice-sharing-icon')).toBeTruthy()
      })
    })
  })

  describe('Read only', () => {
    it('should show text and icon if editor is read only', () => {
      useQuery.mockReturnValue(officeDocParam)

      const { root } = setup({ isReadOnly: true, isMobile: false })
      const { queryByTestId } = root

      expect(queryByTestId('onlyoffice-readonly-icon')).toBeTruthy()
      expect(queryByTestId('onlyoffice-readonly-text')).toBeTruthy()
    })

    it('should not show text and icon if editor is not read only', () => {
      useQuery.mockReturnValue(officeDocParam)

      const { root } = setup({ isReadOnly: false, isMobile: false })
      const { queryByTestId } = root

      expect(queryByTestId('onlyoffice-readonly-icon')).toBeFalsy()
      expect(queryByTestId('onlyoffice-readonly-text')).toBeFalsy()
    })

    describe('Read only on mobile', () => {
      it('should show only icon if editor is read only', () => {
        useQuery.mockReturnValue(officeDocParam)

        const { root } = setup({ isReadOnly: true, isMobile: true })
        const { queryByTestId } = root

        expect(queryByTestId('onlyoffice-readonly-icon-only')).toBeTruthy()
        expect(queryByTestId('onlyoffice-readonly-text')).toBeFalsy()
      })

      it('should not show text and icon if editor is not read only', () => {
        useQuery.mockReturnValue(officeDocParam)

        const { root } = setup({ isReadOnly: false, isMobile: true })
        const { queryByTestId } = root

        expect(queryByTestId('onlyoffice-readonly-icon')).toBeFalsy()
        expect(queryByTestId('onlyoffice-readonly-text')).toBeFalsy()
      })
    })
  })

  const savedLocation = window.location
  const makeNewLocation = (path = '') => {
    window.location = new URL(`http://cozy-test.tools/${path}`)
  }

  describe('Back Button', () => {
    beforeEach(() => {
      delete window.location
    })

    afterEach(() => {
      window.location = savedLocation
    })

    it('should hide without redirect link into searchParam', () => {
      makeNewLocation('#/onlyoffice/123')
      useQuery.mockReturnValue(officeDocParam)

      setup()

      const backButton = screen.queryByRole('button', {
        name: 'Back'
      })
      expect(backButton).toBeNull()
    })

    it('should redirect to previous folder with #/hash?searchParam ', async () => {
      makeNewLocation('#/onlyoffice/123?redirectLink=drive%23%2Ffolder%2F321')
      useQuery.mockReturnValue(officeDocParam)

      setup()

      const button = await screen.findByRole('button', {
        name: 'Back'
      })

      fireEvent.click(button)

      expect(window.location).toBe('http://cozy-drive.tools/#/folder/321')
    })

    it('should redirect to previous folder with ?searchParam#/hash', async () => {
      makeNewLocation('?redirectLink=drive%23%2Ffolder%2F321#/onlyoffice/123')
      useQuery.mockReturnValue(officeDocParam)

      setup()

      const button = await screen.findByRole('button', {
        name: 'Back'
      })

      fireEvent.click(button)

      expect(window.location).toBe('http://cozy-drive.tools/#/folder/321')
    })

    it('should redirect to previous folder from current cozy user', async () => {
      client.collection = () => ({
        fetchOwnPermissions: () =>
          Promise.resolve({
            included: [
              {
                attributes: {
                  instance: 'http://other.tools/'
                }
              }
            ]
          })
      })
      makeNewLocation('?redirectLink=drive%23%2Ffolder%2F321#/onlyoffice/123')
      useQuery.mockReturnValue(officeDocParam)

      setup()

      const button = await screen.findByRole('button', {
        name: 'Back'
      })

      fireEvent.click(button)

      expect(window.location).toBe('http://other-drive.tools/#/folder/321')
    })
  })
})
