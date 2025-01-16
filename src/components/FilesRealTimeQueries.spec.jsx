import { createMockClient } from 'cozy-client'

import { makeTutu, normalizeRef } from './FilesRealTimeQueries'

const client = createMockClient()
client.collection = jest.fn().mockReturnValue({
  addReferencedBy: jest.fn((doc, refs) => ({
    data: {
      ...doc,
      relationships: { referenced_by: { data: refs } }
    }
  }))
})

describe('makeTutu', () => {
  it('should return doc with updated relationships', async () => {
    const contactsRef = [
      {
        id: '123456',
        type: 'io.cozy.contacts'
      }
    ]

    const doc = {
      _id: '123',
      _type: 'io.cozy.files',
      referenced_by: contactsRef
    }

    const res = await makeTutu(doc, client)

    expect(res).toStrictEqual({
      ...doc,
      relationships: {
        referenced_by: { data: contactsRef.map(normalizeRef) }
      }
    })
  })

  it('should return doc with updated relationships when adding 2 contacts', async () => {
    const contactsRef = [
      {
        id: '123456',
        type: 'io.cozy.contacts'
      },
      {
        id: '789456',
        type: 'io.cozy.contacts'
      }
    ]

    const doc = {
      _id: '123',
      _type: 'io.cozy.files',
      referenced_by: contactsRef
    }

    const res = await makeTutu(doc, client)

    expect(res).toStrictEqual({
      ...doc,
      relationships: {
        referenced_by: { data: contactsRef.map(normalizeRef) }
      }
    })
  })

  it('should return doc as is', async () => {
    const contactsRef = [
      {
        id: '123456',
        type: 'io.cozy.contacts'
      }
    ]

    const doc = {
      _id: '123',
      _type: 'io.cozy.files',
      referenced_by: contactsRef,
      relationships: { referenced_by: { data: contactsRef } }
    }

    const res = await makeTutu(doc, client)

    expect(res).toStrictEqual(doc)
  })
})
