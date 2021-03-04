import React from 'react'
import { render } from '@testing-library/react'

import { createMockClient } from 'cozy-client'
import { isMobileApp } from 'cozy-device-helper'

import AppLike from 'test/components/AppLike'

import FooterContent from './FooterContent'

jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn()
}))

const file = {
  id: 'fileId',
  name: 'Demo.pdf'
}

const client = createMockClient({})

const setup = ({
  byDocId = { fileId: {} },
  isOwner = false,
  isMobileAppValue = false
} = {}) => {
  const mockSharingContext = {
    byDocId,
    documentType: 'Files',
    isOwner: () => isOwner
  }

  isMobileApp.mockReturnValue(isMobileAppValue)

  const root = render(
    <AppLike client={client} sharingContextValue={mockSharingContext}>
      <FooterContent file={file} />
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
})
