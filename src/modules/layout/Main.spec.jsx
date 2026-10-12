import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import flag from 'cozy-flags'

import Main from './Main'

import { ROUTER_FUTURE_FLAGS } from '@/constants/config'

jest.mock('cozy-ui/transpiled/react/Layout', () => ({
  Main: ({ children }) => <div>{children}</div>
}))
jest.mock('cozy-flags', () => jest.fn())
jest.mock('@/components/PushBanner', () => () => (
  <div data-testid="push-banner" />
))
jest.mock('@/modules/views/Sharings/SharingInvitations', () => () => (
  <div data-testid="sharing-invitations" />
))
jest.mock('@/modules/shareddrives/hooks/useSharedDrives', () => ({
  useSharedDrives: () => ({
    sharedDrives: [{ _id: 'org-drive-id', org_drive: true }]
  })
}))
jest.mock('@/components/Migration/MigrationProgressBanner', () => ({
  MigrationProgressBanner: () => <div data-testid="migration-banner" />
}))

function renderAt(ui, pathname = '/folder') {
  return render(
    <MemoryRouter future={ROUTER_FUTURE_FLAGS} initialEntries={[pathname]}>
      {ui}
    </MemoryRouter>
  )
}

describe('Main', () => {
  beforeEach(() => {
    flag.mockReturnValue(true)
  })

  it('does not mount PushBanner on the public route', () => {
    // PushBanner calls useInstanceInfo, which queries /settings/disk-usage. A
    // public-share token cannot read it (403), and cozy-client's useQuery does
    // not catch that rejection. PushBanner renders null on
    // public anyway, so it must not be mounted there at all.
    renderAt(<Main isPublic>{[]}</Main>)

    expect(screen.queryByTestId('push-banner')).toBeNull()
  })

  it('mounts PushBanner on the authenticated route', () => {
    renderAt(<Main isPublic={false}>{[]}</Main>)

    expect(screen.queryByTestId('push-banner')).not.toBeNull()
  })

  it('mounts the sharing invitations below the push banner', () => {
    renderAt(<Main isPublic={false}>{[]}</Main>)

    const pushBanner = screen.getByTestId('push-banner')
    const invitations = screen.getByTestId('sharing-invitations')
    expect(
      pushBanner.compareDocumentPosition(invitations) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('does not mount the sharing invitations on the public route', () => {
    renderAt(<Main isPublic>{[]}</Main>)

    expect(screen.queryByTestId('sharing-invitations')).toBe(null)
  })

  it('only mounts the sharing invitations on sharings pages', () => {
    renderAt(<Main isPublic={false}>{[]}</Main>, '/sharings/with-me')

    expect(screen.queryByTestId('sharing-invitations')).toBeInTheDocument()
    expect(screen.queryByTestId('push-banner')).toBe(null)
    expect(screen.queryByTestId('migration-banner')).toBe(null)
  })

  it('only mounts the sharing invitations in a shared folder', () => {
    renderAt(
      <Main isPublic={false}>{[]}</Main>,
      '/shareddrive/drive-id/folder-id'
    )

    expect(screen.queryByTestId('sharing-invitations')).toBeInTheDocument()
    expect(screen.queryByTestId('push-banner')).toBe(null)
  })

  it('mounts every banner in an organization drive', () => {
    renderAt(
      <Main isPublic={false}>{[]}</Main>,
      '/shareddrive/org-drive-id/folder-id'
    )

    expect(screen.queryByTestId('push-banner')).toBeInTheDocument()
    expect(screen.queryByTestId('sharing-invitations')).toBeInTheDocument()
  })

  it('does not mount the migration banner when the flag is off', () => {
    flag.mockReturnValue(false)

    renderAt(<Main isPublic={false}>{[]}</Main>)

    expect(screen.queryByTestId('migration-banner')).toBeNull()
  })

  it('mounts the migration banner when the flag is on', () => {
    renderAt(<Main isPublic={false}>{[]}</Main>)

    expect(screen.queryByTestId('migration-banner')).not.toBeNull()
  })
})
