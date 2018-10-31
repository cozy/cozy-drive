import reducer, {
  receiveSharings,
  addSharing,
  addSharingLink,
  revokeSharingLink,
  getRecipients,
  revokeRecipient,
  revokeSelf,
  getSharingLink
} from '../state'

import {
  SHARING_1,
  SHARING_2,
  SHARING_3,
  PERM_1,
  PERM_2,
  APPS
} from './fixtures'

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

    it('should get a sharing link', () => {
      expect(getSharingLink(state, 'folder_1', 'Files')).toBe(
        'http://drive.cozy.tools:8080/public?sharecode=secret&id=folder_1'
      )
    })
  })
})
