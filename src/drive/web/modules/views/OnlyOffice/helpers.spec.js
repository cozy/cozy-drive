import {
  showSharingBanner,
  makeName
} from 'drive/web/modules/views/OnlyOffice/helpers'

describe('makeName', () => {
  describe('for public route', () => {
    it('should return undefined if it is not an accepted document from cozy to cozy sharing', () => {
      expect(
        makeName({
          isPublic: true,
          isFromSharing: false,
          username: 'bob',
          public_name: 'alice'
        })
      ).toBe(undefined)
      expect(
        makeName({
          isPublic: true,
          isFromSharing: false,
          username: undefined,
          public_name: 'alice'
        })
      ).toBe(undefined)
      expect(
        makeName({
          isPublic: true,
          isFromSharing: false,
          username: 'bob',
          public_name: undefined
        })
      ).toBe(undefined)
      expect(
        makeName({
          isPublic: true,
          isFromSharing: false,
          username: undefined,
          public_name: undefined
        })
      ).toBe(undefined)
    })

    it('should return the name of the sharing recipient for a document shared from cozy to cozy', () => {
      expect(
        makeName({
          isPublic: true,
          isFromSharing: true,
          username: 'bob',
          public_name: 'alice'
        })
      ).toBe('bob')
      expect(
        makeName({
          isPublic: true,
          isFromSharing: true,
          username: 'bob',
          public_name: undefined
        })
      ).toBe('bob')
      expect(
        makeName({
          isPublic: true,
          isFromSharing: true,
          username: undefined,
          public_name: undefined
        })
      ).toBe(undefined)
    })
  })

  it('should return the public name if no sharing recipient', () => {
    expect(
      makeName({
        isPublic: false,
        isFromSharing: false,
        username: undefined,
        public_name: undefined
      })
    ).toBe(undefined)
    expect(
      makeName({
        isPublic: false,
        isFromSharing: false,
        username: undefined,
        public_name: 'alice'
      })
    ).toBe('alice')
  })

  it('should return the name of the sharing recipient if present', () => {
    expect(
      makeName({
        isPublic: false,
        isFromSharing: false,
        username: 'bob',
        public_name: 'alice'
      })
    ).toBe('bob')
    expect(
      makeName({
        isPublic: false,
        isFromSharing: false,
        username: 'bob',
        public_name: undefined
      })
    ).toBe('bob')
  })
})

describe('showSharingBanner', () => {
  describe('for 1 entry in history', () => {
    it('should not show the banner when it comes from a synchronized cozy to cozy sharing', () => {
      expect(window.history.length).toBe(1)

      expect(
        showSharingBanner({
          isFromSharing: true,
          isPublic: false,
          isInSharedFolder: false
        })
      ).toBe(false)
    })

    it('should show the banner - preview for cozy to cozy sharing - coming from mail', () => {
      expect(window.history.length).toBe(1)

      expect(
        showSharingBanner({
          isFromSharing: false,
          isPublic: true,
          isInSharedFolder: false
        })
      ).toBe(true)
    })
  })

  describe('for 2 entries in history', () => {
    beforeAll(() => {
      window.history.pushState('data', 'title', 'url')
    })

    it('should not show the banner when it comes from a synchronized cozy to cozy sharing', () => {
      expect(window.history.length).toBe(2)

      expect(
        showSharingBanner({
          isFromSharing: true,
          isPublic: false,
          isInSharedFolder: false
        })
      ).toBe(false)
    })

    it('should show the banner - preview for sharing by link, or cozy to cozy coming from shortcut', () => {
      expect(window.history.length).toBe(2)

      expect(
        showSharingBanner({
          isFromSharing: false,
          isPublic: true,
          isInSharedFolder: false
        })
      ).toBe(true)
    })

    it('should not show the banner - preview for cozy to cozy shared folder - coming from mail', () => {
      expect(window.history.length).toBe(2)

      expect(
        showSharingBanner({
          isFromSharing: false,
          isPublic: true,
          isInSharedFolder: true
        })
      ).toBe(false)
    })
  })

  describe('for 3 entries in history', () => {
    beforeAll(() => {
      window.history.pushState('data', 'title', 'url')
    })

    it('should not show the banner when it comes from a synchronized cozy to cozy sharing', () => {
      expect(window.history.length).toBe(3)

      expect(
        showSharingBanner({
          isFromSharing: true,
          isPublic: false,
          isInSharedFolder: false
        })
      ).toBe(false)
    })

    it('should not show the banner - preview for cozy to cozy shared folder coming from shortcut, or for a folder shared by link', () => {
      expect(window.history.length).toBe(3)

      expect(
        showSharingBanner({
          isFromSharing: false,
          isPublic: true,
          isInSharedFolder: true
        })
      ).toBe(false)
    })
  })
})
