import reducer, {
  receiveSharings,
  addSharing,
  addSharingLink,
  revokeSharingLink,
  getRecipients,
  revokeRecipient,
  revokeSelf,
  matchingInstanceName,
  getSharingLink,
  hasSharedParent,
  isShared
} from './state'

import {
  SHARING_1,
  SHARING_2,
  SHARING_3,
  PERM_1,
  PERM_2,
  APPS
} from './__tests__/fixtures'

describe('Sharing state', () => {
  it('should have a default state', () => {
    const state = reducer()
    expect(state).toEqual({
      byDocId: {},
      sharings: [],
      permissions: [],
      apps: [],
      sharedPaths: []
    })
  })

  it('should index received sharings', () => {
    const state = reducer(
      undefined,
      receiveSharings({ sharings: [SHARING_1, SHARING_2] })
    )
    expect(state.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [] },
      folder_2: { sharings: [SHARING_2.id], permissions: [] }
    })
    expect(state.sharings).toEqual([SHARING_1, SHARING_2])
  })

  it('should filter out sharings revoked by all recipients', () => {
    const SHARING_2bis = {
      ...SHARING_2,
      attributes: {
        ...SHARING_2.attributes,
        members: [
          {
            status: 'owner',
            name: 'Jane Doe',
            email: 'jane@doe.com',
            instance: 'http://cozy.tools:8080'
          },
          {
            status: 'revoked',
            name: 'John Doe',
            email: 'john@doe.com',
            instance: 'http://cozy.local:8080'
          }
        ]
      }
    }
    const state = reducer(
      undefined,
      receiveSharings({ sharings: [SHARING_1, SHARING_2bis] })
    )
    expect(state.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [] }
    })
    expect(state.sharings).toEqual([SHARING_1])
  })

  it('should index received permissions', () => {
    const state = reducer(
      undefined,
      receiveSharings({
        sharings: [SHARING_1, SHARING_2],
        permissions: [PERM_1]
      })
    )
    expect(state.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [PERM_1.id] },
      folder_2: { sharings: [SHARING_2.id], permissions: [] }
    })
    expect(state.permissions).toEqual([PERM_1])
  })

  it('should index a newly created sharing', () => {
    const initialState = reducer(
      undefined,
      receiveSharings({
        sharings: [SHARING_1, SHARING_2]
      })
    )
    const newState = reducer(initialState, addSharing(SHARING_3))
    expect(newState.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id, SHARING_3.id], permissions: [] },
      folder_2: { sharings: [SHARING_2.id], permissions: [] }
    })
    expect(newState.sharings).toEqual([SHARING_1, SHARING_2, SHARING_3])
  })

  it('should revoke a recipient', () => {
    const state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2]
        })
      ),
      revokeRecipient(SHARING_1, 1)
    )
    expect(state.sharings[0].attributes.members).toHaveLength(
      SHARING_1.attributes.members.length
    )
    expect(state.sharings[0].attributes.members[1].status).toEqual('revoked')
  })

  it('should revoke a recipient even when removing one in the middle', () => {
    const state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2]
        })
      ),
      revokeRecipient(SHARING_1, 1)
    )
    expect(state.sharings[0].attributes.members).toHaveLength(
      SHARING_1.attributes.members.length
    )
    expect(state.sharings[0].attributes.members[1].status).toEqual('revoked')
    expect(state.sharings[0].attributes.members[2].id).toEqual(
      SHARING_1.attributes.members[2].id
    )
  })

  it('should revoke self', () => {
    const state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2]
        })
      ),
      revokeSelf(SHARING_1)
    )
    expect(state.byDocId).toEqual({
      folder_2: { sharings: [SHARING_2.id], permissions: [] }
    })
  })

  it('should index a newly created sharing link', () => {
    const initialState = reducer(
      undefined,
      receiveSharings({
        sharings: [SHARING_1, SHARING_2],
        permissions: [PERM_1]
      })
    )
    const newState = reducer(initialState, addSharingLink(PERM_2))
    expect(newState.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [PERM_1.id] },
      folder_2: { sharings: [SHARING_2.id], permissions: [PERM_2.id] }
    })
    expect(newState.permissions).toEqual([PERM_1, PERM_2])
  })

  it('should revoke a sharing link', () => {
    const initialState = reducer(
      undefined,
      receiveSharings({
        sharings: [SHARING_1, SHARING_2],
        permissions: [PERM_1, PERM_2]
      })
    )
    const newState = reducer(initialState, revokeSharingLink([PERM_1]))
    expect(newState.byDocId).toEqual({
      folder_1: { sharings: [SHARING_1.id], permissions: [] },
      folder_2: { sharings: [SHARING_2.id], permissions: [PERM_2.id] }
    })
    expect(newState.permissions).toEqual([PERM_2])
  })

  describe('selectors', () => {
    const state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2],
          permissions: [PERM_1],
          apps: APPS
        })
      ),
      addSharing(SHARING_3)
    )

    it('should list all sharing recipients for a doc', () => {
      expect(getRecipients(state, 'folder_1')).toEqual([
        {
          email: 'jane@doe.com',
          instance: 'http://cozy.tools:8080',
          name: 'Jane Doe',
          sharingId: 'sharing_1',
          index: 0,
          status: 'owner',
          type: 'two-way'
        },
        {
          email: 'john@doe.com',
          instance: 'http://cozy.local:8080',
          name: 'John Doe',
          sharingId: 'sharing_1',
          index: 1,
          status: 'ready',
          type: 'two-way'
        },
        {
          email: 'john2@doe.com',
          instance: 'http://cozy.local:8080',
          name: 'John Doe 2',
          sharingId: 'sharing_1',
          index: 2,
          status: 'ready',
          type: 'two-way'
        },
        {
          email: 'johnny@doe.com',
          instance: 'http://cozy.foo:8080',
          name: 'Johnny Doe',
          sharingId: 'sharing_3',
          index: 1,
          status: 'pending',
          type: 'two-way'
        }
      ])
    })
  })
})

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
    state = reducer(
      reducer(
        undefined,
        receiveSharings({
          sharings: [SHARING_1, SHARING_2],
          permissions: [PERM_1, PERM_2],
          apps: APPS
        })
      )
    )
  })

  it('should use the correct app', () => {
    expect(getSharingLink(state, 'folder_1', 'Document')).toBe(
      'https://drive.cozy.tools/public?sharecode=longcode'
    )
    expect(getSharingLink(state, 'folder_1', 'Files')).toBe(
      'https://drive.cozy.tools/public?sharecode=longcode'
    )
    expect(getSharingLink(state, 'folder_1', 'Albums')).toBe(
      'https://photos.cozy.tools/public?sharecode=longcode'
    )
  })

  it('should throw when no app is found', () => {
    expect(() =>
      getSharingLink(state, 'folder_1', 'made up for the test')
    ).toThrow(
      "Sharing link: don't know which app to use for doctype made up for the test"
    )
    state.apps = []
    expect(() => getSharingLink(state, 'folder_1', 'Document')).toThrow(
      'Sharing link: app drive not installed'
    )
  })

  it('should use long codes', () => {
    expect(getSharingLink(state, 'folder_1', 'Document')).toBe(
      'https://drive.cozy.tools/public?sharecode=longcode'
    )
  })

  it('should prefer short codes', () => {
    expect(getSharingLink(state, 'folder_2', 'Document')).toBe(
      'https://drive.cozy.tools/public?sharecode=shortcode'
    )
  })
})

describe('hasSharedParent helper', () => {
  it("should return true if one of the document's parents is shared", () => {
    const state = {
      sharedPaths: ['/dir0/doc0', '/dir1', '/dir2/doc1']
    }
    const document = {
      path: '/dir1/subdir0/doc2'
    }
    const result = hasSharedParent(state, document)
    expect(result).toBe(true)
  })

  it("should return true if one of the document's parents is shared", () => {
    const state = {
      sharedPaths: ['/dir0/doc0', '/dir1', '/dir2/doc1']
    }
    const document = {
      path: '/dir3/doc3'
    }
    const result = hasSharedParent(state, document)
    expect(result).toBe(false)
  })
})

describe('isShared helper', () => {
  it('should return true if document is shared', () => {
    const state = {
      sharedPaths: ['/dir0/doc0', '/dir1/doc1']
    }
    const document = {
      path: '/dir1/doc1'
    }
    const result = isShared(state, document)
    expect(result).toBe(true)
  })

  it('should return true if document is shared', () => {
    const state = {
      sharedPaths: ['/dir0/doc0', '/dir1/doc1']
    }
    const document = {
      path: '/dir1/doc2'
    }
    const result = isShared(state, document)
    expect(result).toBe(false)
  })
})
