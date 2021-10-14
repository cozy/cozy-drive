import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { createMockClient } from 'cozy-client'
import { isMobileApp } from 'cozy-device-helper'

import AppLike from 'test/components/AppLike'

import * as utils from 'drive/web/modules/actions/utils'
import FooterContent from './FooterContent'

jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn()
}))

jest.mock('cozy-keys-lib', () => ({
  useVaultClient: jest.fn()
}))

const staticFile = {
  id: 'fileId',
  name: 'Demo.pdf'
}

const client = createMockClient({})
const vaultClient = {}

const setup = ({
  byDocId = { fileId: {} },
  isOwner = false,
  isMobileAppValue = false,
  file
} = {}) => {
  const mockSharingContext = {
    byDocId,
    documentType: 'Files',
    isOwner: () => isOwner
  }

  isMobileApp.mockReturnValue(isMobileAppValue)

  const root = render(
    <AppLike
      client={client}
      vaultClient={vaultClient}
      sharingContextValue={mockSharingContext}
    >
      <FooterContent file={file || staticFile} toolbarRef={{}} />
    </AppLike>
  )

  return { root }
}

describe('FooterContent', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should show download button if not in mobile app', () => {
    const { root } = setup()
    const { getByText, queryByText } = root

    expect(getByText('Download'))
    expect(queryByText('Forward')).toBeFalsy()
  })

  it('should show forward button if in mobile app', () => {
    const { root } = setup({ isMobileAppValue: true })
    const { getByText, queryByText } = root

    expect(getByText('Forward'))
    expect(queryByText('Download')).toBeFalsy()

    const spy = jest.spyOn(utils, 'exportFilesNative')
    fireEvent.click(getByText('Forward'))
    expect(spy).toHaveBeenCalled()
  })

  it('should show "share" if the file is not shared', () => {
    const { root } = setup({ byDocId: {} })
    const { getByText, queryByText } = root

    expect(getByText('Share'))
    expect(queryByText('Shared')).toBeFalsy()
  })

  it('should show "shared" if the file is shared', () => {
    const { root } = setup()
    const { getByText, queryByText } = root

    expect(getByText('Shared'))
    expect(queryByText('Share')).toBeFalsy()
  })

  it('should show simply "shared" even if the file is shared by me', () => {
    const { root } = setup({ isOwner: true })
    const { getByText, queryByText } = root

    expect(getByText('Shared'))
    expect(queryByText('Share')).toBeFalsy()
  })

  it('should show bottom sheet for file with certification or konnector', () => {
    const { root } = setup({
      file: { metadata: { carbonCopy: true }, ...staticFile }
    })
    const { getByTestId } = root

    expect(getByTestId('bottomSheet-header')).toBeTruthy()
  })
})
