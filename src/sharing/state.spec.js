import { matchingInstanceName, getSharingLink } from './state'

describe('finding matching instance names', () => {
  const instanceURI = 'https://yes.com'

  it('should work in a simple case', () => {
    const members = [{ instance: instanceURI }, { instance: 'https://no.com' }]
    expect(members.find(matchingInstanceName(instanceURI))).toEqual(members[0])
  })

  it('should match instance names with a different casing', () => {
    const members = [
      { instance: 'https://no.com' },
      { instance: 'https://YES.COM' }
    ]
    expect(members.find(matchingInstanceName(instanceURI))).toEqual(members[1])
  })
})

describe('generating a sharing link', () => {
  let state

  beforeEach(() => {
    state = {
      byDocId: {
        '123': {
          permissions: ['longcodesonly']
        },
        '456': {
          permissions: ['shortcodesonly']
        },
        '789': {
          permissions: ['both']
        }
      },
      permissions: [
        {
          id: 'longcodesonly',
          attributes: {
            codes: {
              email: 'longcode'
            }
          }
        },
        {
          id: 'shortcodesonly',
          attributes: {
            shortcodes: {
              email: 'shortcode'
            }
          }
        },
        {
          id: 'both',
          comment: 'no codes',
          attributes: {
            shortcodes: {
              email: 'shortcode2'
            },
            codes: {
              email: 'longcode2'
            }
          }
        }
      ],
      apps: [
        {
          attributes: {
            state: 'ready',
            slug: 'drive'
          },
          links: {
            related: 'https://drive.cozy.test/'
          }
        },
        {
          attributes: {
            state: 'ready',
            slug: 'photos'
          },
          links: {
            related: 'https://photos.cozy.test/'
          }
        }
      ]
    }
  })

  it('should use the correct app', () => {
    expect(getSharingLink(state, '123', 'Document')).toBe(
      'https://drive.cozy.test/public?sharecode=longcode'
    )
    expect(getSharingLink(state, '123', 'Files')).toBe(
      'https://drive.cozy.test/public?sharecode=longcode'
    )
    expect(getSharingLink(state, '123', 'Albums')).toBe(
      'https://photos.cozy.test/public?sharecode=longcode'
    )
  })

  it('should throw when no app is found', () => {
    expect(() => getSharingLink(state, '123', 'made up for the test')).toThrow(
      "Sharing link: don't know which app to use for doctype made up for the test"
    )
    state.apps = []
    expect(() => getSharingLink(state, '123', 'Document')).toThrow(
      'Sharing link: app drive not installed'
    )
  })

  it('should use long codes', () => {
    expect(getSharingLink(state, '123', 'Document')).toBe(
      'https://drive.cozy.test/public?sharecode=longcode'
    )
  })

  it('should use short codes', () => {
    expect(getSharingLink(state, '456', 'Document')).toBe(
      'https://drive.cozy.test/public?sharecode=shortcode'
    )
  })

  it('should prefer short codes', () => {
    expect(getSharingLink(state, '789', 'Document')).toBe(
      'https://drive.cozy.test/public?sharecode=shortcode2'
    )
  })
})
