import { render } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { CertificationsIcons } from './FileName'
import AppLike from 'test/components/AppLike'

const client = new createMockClient({})
const setup = ({ attributes }) => {
  const root = render(
    <AppLike client={client}>
      <CertificationsIcons attributes={attributes} />
    </AppLike>
  )

  return { root }
}

describe('CertificationsIcons', () => {
  it('should render only carbon copy app icon', () => {
    const { root } = setup({
      attributes: {
        metadata: { carbonCopy: true, electronicSafe: false },
        cozyMetadata: { uploadedBy: { slug: 'pajemploi' } }
      }
    })
    const { queryByTestId } = root

    expect(queryByTestId('certificationsIcons-carbonCopyAppIcon')).toBeTruthy()
    expect(queryByTestId('certificationsIcons-carbonCopyIcon')).toBeFalsy()
    expect(
      queryByTestId('certificationsIcons-electronicSafeAppIcon')
    ).toBeFalsy()
  })

  it('should render only electronic safe app icon', () => {
    const { root } = setup({
      attributes: {
        metadata: { carbonCopy: false, electronicSafe: true },
        cozyMetadata: { uploadedBy: { slug: 'pajemploi' } }
      }
    })
    const { queryByTestId } = root

    expect(queryByTestId('certificationsIcons-carbonCopyAppIcon')).toBeFalsy()
    expect(queryByTestId('certificationsIcons-carbonCopyIcon')).toBeFalsy()
    expect(
      queryByTestId('certificationsIcons-electronicSafeAppIcon')
    ).toBeTruthy()
  })

  it('should render carbon copy icon and electronic safe app icon', () => {
    const { root } = setup({
      attributes: {
        metadata: { carbonCopy: true, electronicSafe: true },
        cozyMetadata: { uploadedBy: { slug: 'pajemploi' } }
      }
    })
    const { queryByTestId } = root

    expect(queryByTestId('certificationsIcons-carbonCopyAppIcon')).toBeFalsy()
    expect(queryByTestId('certificationsIcons-carbonCopyIcon')).toBeTruthy()
    expect(
      queryByTestId('certificationsIcons-electronicSafeAppIcon')
    ).toBeTruthy()
  })

  it('should render no certifications icon', () => {
    const { root } = setup({
      attributes: {
        metadata: { carbonCopy: false, electronicSafe: false },
        cozyMetadata: { uploadedBy: { slug: 'pajemploi' } }
      }
    })
    const { queryByTestId } = root

    expect(queryByTestId('certificationsIcons-carbonCopyAppIcon')).toBeFalsy()
    expect(queryByTestId('certificationsIcons-carbonCopyIcon')).toBeFalsy()
    expect(
      queryByTestId('certificationsIcons-electronicSafeAppIcon')
    ).toBeFalsy()
  })

  it('should render no certifications icon and not throw error with empty attributes', () => {
    const { root } = setup({
      attributes: {}
    })
    const { queryByTestId } = root

    expect(queryByTestId('certificationsIcons-carbonCopyAppIcon')).toBeFalsy()
    expect(queryByTestId('certificationsIcons-carbonCopyIcon')).toBeFalsy()
    expect(
      queryByTestId('certificationsIcons-electronicSafeAppIcon')
    ).toBeFalsy()
  })
})
