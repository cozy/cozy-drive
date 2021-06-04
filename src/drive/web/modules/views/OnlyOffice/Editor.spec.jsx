import React from 'react'
import { render } from '@testing-library/react'

import { createMockClient, useQuery } from 'cozy-client'
import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'

import AppLike from 'test/components/AppLike'
import { officeDocParam } from 'test/data'

import { isOnlyOfficeEnabled } from 'drive/web/modules/views/OnlyOffice/helpers'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'
import Editor from 'drive/web/modules/views/OnlyOffice/Editor'

jest.mock('cozy-client/dist/hooks/useFetchJSON', () => ({
  __esModule: true,
  default: jest.fn(),
  useFetchJSON: jest.fn()
}))

jest.mock('drive/web/modules/views/OnlyOffice/helpers', () => ({
  ...jest.requireActual('drive/web/modules/views/OnlyOffice/helpers'),
  isOnlyOfficeEnabled: jest.fn()
}))

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

const client = createMockClient({})

const setup = () => {
  const root = render(
    <AppLike
      client={client}
      routerContextValue={{
        router: { location: { pathname: '/onlyoffice/fileId' } }
      }}
      sharingContextValue={{
        byDocId: {},
        documentType: 'Files'
      }}
    >
      <OnlyOfficeContext.Provider
        value={{
          fileId: '123',
          isPublic: 'false',
          isEditorReadOnly: false,
          setIsEditorReadOnly: jest.fn()
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

  it('should not show the title but the CozyUi Viewer instead if stack returns an error', () => {
    useFetchJSON.mockReturnValue({ fetchStatus: 'error', data: undefined })
    useQuery.mockReturnValue(officeDocParam)

    const { root } = setup()
    const { queryByTestId, getAllByText } = root

    expect(queryByTestId('onlyoffice-content-spinner')).toBeFalsy()
    expect(queryByTestId('onlyoffice-title')).toBeFalsy()
    expect(queryByTestId('viewer-toolbar')).toBeTruthy()
    expect(getAllByText('Download')).toBeTruthy()
  })

  it('should show the title and the container view', () => {
    useFetchJSON.mockReturnValue({
      fetchStatus: 'loaded',
      data: officeDocParam
    })
    useQuery.mockReturnValue(officeDocParam)
    isOnlyOfficeEnabled.mockReturnValue(true)

    const { root } = setup()
    const { container, queryByTestId } = root

    expect(queryByTestId('onlyoffice-content-spinner')).toBeFalsy()
    expect(queryByTestId('onlyoffice-title')).toBeTruthy()
    expect(container.querySelector('#onlyOfficeEditor')).toBeTruthy()
  })

  it('should show the CozyUi Viewer if the only office server is not installed', () => {
    useFetchJSON.mockReturnValue({
      fetchStatus: 'loaded',
      data: officeDocParam
    })
    useQuery.mockReturnValue(officeDocParam)
    isOnlyOfficeEnabled.mockReturnValue(false)

    const { root } = setup()
    const { queryByTestId, getAllByText } = root

    expect(queryByTestId('onlyoffice-content-spinner')).toBeFalsy()
    expect(queryByTestId('onlyoffice-title')).toBeFalsy()
    expect(queryByTestId('viewer-toolbar')).toBeTruthy()
    expect(getAllByText('Download')).toBeTruthy()
  })
})
