import cozy from 'cozy-client-js'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import CozyClient from '../CozyClient'
import cozyMiddleware from '../middleware'
import { reducer as cozyReducer } from '..'
import {
  share,
  shareByLink,
  getSharingStatus,
  getSharingLink,
  fetchApps
} from '../slices/sharings'

import {
  FAKE_FOLDER,
  KNOWN_CONTACT,
  APPS_RESPONSE,
  CREATE_SHARING_RESPONSE,
  CREATE_SHARED_LINK_RESPONSE,
  SHARING_1
} from '../__fixtures__/sharings'

const mockResponseOnce = response =>
  cozy.client.fetchJSON.mockImplementationOnce(
    async () =>
      // TODO: fetchJSON only returns the data prop of the response when data is an object,
      // thus we're losing the included docs, which is sad
      response.data
  )

describe('Sharings', () => {
  let client, store

  beforeEach(() => {
    client = new CozyClient({
      cozyURL: 'http://cozy.tools:8080',
      token: 'AZERTY'
    })
    store = createStore(
      combineReducers({ cozy: cozyReducer }),
      applyMiddleware(cozyMiddleware(client), thunkMiddleware)
    )
  })

  afterEach(() => {
    cozy.client.fetchJSON.mockClear()
  })

  describe('Given a folder is shared by link', () => {
    beforeEach(done => {
      mockResponseOnce(APPS_RESPONSE)
      mockResponseOnce(CREATE_SHARED_LINK_RESPONSE)
      Promise.all([
        store.dispatch(fetchApps()),
        store.dispatch(shareByLink(FAKE_FOLDER))
      ]).then(() => done())
    })

    it('Should call the right route', () => {
      expect(cozy.client.fetchJSON.mock.calls[1][0]).toEqual('POST')
      expect(cozy.client.fetchJSON.mock.calls[1][1]).toEqual(
        '/permissions?codes=email'
      )
    })

    it('Should send the right payload to the stack', () => {
      expect(cozy.client.fetchJSON.mock.calls[1][2]).toEqual({
        data: {
          type: 'io.cozy.permissions',
          attributes: {
            permissions: {
              files: {
                type: 'io.cozy.files',
                verbs: ['GET'],
                values: [FAKE_FOLDER._id]
              }
            }
          }
        }
      })
    })

    it('Should have a local status', () => {
      expect(
        getSharingLink(store.getState(), FAKE_FOLDER._type, FAKE_FOLDER._id)
      ).toEqual(
        'http://drive.cozy.tools:8080/public?sharecode=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzaGFyZSIsImlhdCI6MTUxNTU4ODk2OSwiaXNzIjoiY296eS50b29sczo4MDgwIiwic3ViIjoiZW1haWwifQ.s4jZoFKym2grmEaO4YlCxzznr9dqiU7IIvgx5cds2oBrM_Cvg0rO1kShqvM3m9CjNSMd-OrlqPfdRVd7_hFy8g&id=02fc14dc3c447824dc32d9198300f57d'
      )
    })
  })

  describe('Given a folder is shared with a known contact', () => {
    beforeEach(done => {
      mockResponseOnce(CREATE_SHARING_RESPONSE)
      store
        .dispatch(
          share(FAKE_FOLDER, [KNOWN_CONTACT], 'two-way', 'Our holidays')
        )
        .then(() => done())
    })

    it('Should call the right route', () => {
      expect(cozy.client.fetchJSON.mock.calls[0][0]).toEqual('POST')
      expect(cozy.client.fetchJSON.mock.calls[0][1]).toEqual('/sharings/')
    })

    it('Should send the right payload to the stack', () => {
      expect(cozy.client.fetchJSON.mock.calls[0][2]).toEqual({
        description: 'Our holidays',
        permissions: {
          files: {
            type: 'io.cozy.files',
            values: [FAKE_FOLDER._id],
            verbs: ['ALL']
          }
        },
        recipients: [KNOWN_CONTACT.id],
        sharing_type: 'two-way'
      })
    })

    it('Should have a local status', () => {
      expect(
        getSharingStatus(store.getState(), FAKE_FOLDER._type, FAKE_FOLDER._id)
      ).toEqual({
        shared: true,
        owner: true,
        sharingType: 'two-way',
        sharings: [SHARING_1]
      })
    })
  })
})
