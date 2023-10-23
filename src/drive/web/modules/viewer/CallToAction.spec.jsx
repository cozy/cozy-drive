import React from 'react'
import { render } from '@testing-library/react'
import CallToAction from './CallToAction'
import localforage from 'localforage'
import { NOVIEWER_DESKTOP_CTA } from 'components/pushClient'

jest.mock('localforage')
jest.mock('drive/config/config.json', () => ({
  promoteDesktop: { isActivated: true }
}))
jest.mock('components/pushClient', () => ({
  isClientAlreadyInstalled: jest.fn().mockResolvedValueOnce(false),
  isLinux: jest.fn(),
  NOVIEWER_DESKTOP_CTA: 'noviewer_desktop_cta'
}))

describe('CallToAction', () => {
  it('should get item noviewer desktop from localforage', async () => {
    // Given
    localforage.getItem = jest.fn().mockResolvedValueOnce(false)

    // When
    await render(<CallToAction t={jest.fn()} />)

    // Then
    expect(localforage.getItem).toHaveBeenCalledWith(NOVIEWER_DESKTOP_CTA)
  })

  it('should use rel="noreferrer" (which implies rel="noopener", because it is a security risk', done => {
    // Given
    localforage.getItem = jest.fn().mockResolvedValueOnce(false)

    // When
    const { container } = render(<CallToAction t={jest.fn()} />)

    // Then
    setTimeout(() => {
      expect(container.querySelector('a[target="_blank"]')).toHaveAttribute(
        'rel',
        'noreferrer'
      )
      done()
    }, 1)
  })
})
