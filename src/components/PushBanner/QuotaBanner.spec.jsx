import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { isFlagshipApp } from 'cozy-device-helper'
import I18n from 'cozy-ui/transpiled/react/I18n'

import useInstanceInfo from 'hooks/useInstanceInfo'
import QuotaBanner from './QuotaBanner'
import { usePushBannerContext } from './PushBannerProvider'
import en from 'drive/locales/en.json'

jest.mock('./PushBannerProvider', () => ({
  usePushBannerContext: jest.fn()
}))
jest.mock('hooks/useInstanceInfo')
jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isFlagshipApp: jest.fn()
}))

describe('QuotaBanner', () => {
  const dismissSpy = jest.fn()
  const openSpy = jest.spyOn(window, 'open').mockImplementation()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const setup = ({
    enablePremiumLinks = false,
    hasUuid = false,
    isFlagshipApp: isFlagshipAppReturnValue = false
  } = {}) => {
    usePushBannerContext.mockReturnValue({
      dismissPushBanner: dismissSpy
    })

    useInstanceInfo.mockReturnValue({
      context: {
        data: {
          attributes: {
            enable_premium_links: enablePremiumLinks,
            manager_url: 'http://mycozy.cloud'
          }
        }
      },
      instance: {
        data: {
          attributes: { uuid: hasUuid ? '123' : null }
        }
      }
    })

    isFlagshipApp.mockReturnValue(isFlagshipAppReturnValue)

    render(
      <I18n lang="en" dictRequire={() => en}>
        <QuotaBanner />
      </I18n>
    )
  }

  it('should display "I understand" button and close the banner', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: 'I understand' }))
    expect(dismissSpy).toBeCalledTimes(1)

    const premiumButton = screen.queryByText('Check our plans')
    expect(premiumButton).toBeNull()
  })

  it('should hide premium link when there is a premium link but it is not enabled', () => {
    setup({
      hasUuid: true
    })

    const premiumButton = screen.queryByText('Check our plans')
    expect(premiumButton).toBeNull()
  })

  it('should display premium link when the premium link is enabled and available', () => {
    setup({
      hasUuid: true,
      enablePremiumLinks: true
    })

    fireEvent.click(screen.getByText('Check our plans'))
    expect(openSpy).toBeCalledWith(
      'http://mycozy.cloud/cozy/instances/123/premium',
      '_self'
    )
  })

  it('should hide premium link when is on flagship application', () => {
    setup({
      hasUuid: true,
      enablePremiumLinks: true,
      isFlagshipApp: true
    })

    const premiumButton = screen.queryByText('Check our plans')
    expect(premiumButton).toBeNull()
  })
})
