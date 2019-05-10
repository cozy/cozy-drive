import React from 'react'
import { mount } from 'enzyme'

import ShareByEmail, { countNewRecipients } from './ShareByEmail'

const fakeDoc = {
  _id: 'c0455ddf-5f4c',
  _type: 'io.cozy.files',
  name: 'fake-doc.odt'
}

const fakeContext = {
  client: {},
  t: jest.fn()
}

describe('ShareByEmail component', () => {
  describe('getSuccessMessage method', () => {
    let component
    const props = {
      contacts: {
        id: 'contacts',
        data: [],
        hasMore: false,
        fetchStatus: 'loaded'
      },
      groups: {
        id: 'groups',
        data: [],
        hasMore: false,
        fetchStatus: 'loaded'
      },
      currentRecipients: [{ email: 'sansa.stark@winterfell.westeros' }],
      document: fakeDoc,
      documentType: 'Files',
      sharingDesc: 'fake-doc.odt',
      onShare: jest.fn(),
      createContact: jest.fn()
    }

    beforeEach(() => {
      component = mount(<ShareByEmail {...props} />, {
        context: fakeContext
      })
    })

    it('should return a success message and its params for multiple recipients', () => {
      component.setState({
        recipients: [
          { email: 'jon.snow@thewall.westeros' },
          { email: 'arya.stark@winterfell.westeros' },
          { email: 'sansa.stark@winterfell.westeros' }
        ]
      })
      const recipientsBefore = props.currentRecipients
      const [message, params] = component
        .instance()
        .getSuccessMessage(recipientsBefore)
      expect(message).toEqual('Files.share.shareByEmail.genericSuccess')
      expect(params).toEqual({ count: 2 })
    })

    // see https://github.com/cozy/cozy-drive/pull/1671
    it('should work if currentRecipients prop change before it is called', () => {
      const newRecipients = [
        { email: 'jon.snow@thewall.westeros' },
        { email: 'arya.stark@winterfell.westeros' },
        { email: 'sansa.stark@winterfell.westeros' }
      ]
      component.setState({
        recipients: newRecipients
      })
      const recipientsBefore = props.currentRecipients
      component.setProps({ ...props, currentRecipients: newRecipients })
      const [message, params] = component
        .instance()
        .getSuccessMessage(recipientsBefore)
      expect(message).toEqual('Files.share.shareByEmail.genericSuccess')
      expect(params).toEqual({ count: 2 })
    })

    it('should return a success message and its params for one recipient with email', () => {
      component.setState({
        recipients: [{ email: 'jon.snow@thewall.westeros' }]
      })
      const recipientsBefore = props.currentRecipients
      const [message, params] = component
        .instance()
        .getSuccessMessage(recipientsBefore)
      expect(message).toEqual('Files.share.shareByEmail.success')
      expect(params).toEqual({ email: 'jon.snow@thewall.westeros' })
    })

    it('should return a success message and its params for one recipient (contact) with email', () => {
      component.setState({
        recipients: [
          {
            _id: 'e8c0e15f-da7d',
            _type: 'io.cozy.contacts',
            fullname: 'Jon Snow',
            email: [
              {
                address: 'jon.snow@thewall.westeros',
                primary: true
              },
              {
                address: 'jon.snow@winterfell.westeros',
                primary: false
              }
            ]
          }
        ]
      })
      const recipientsBefore = props.currentRecipients
      const [message, params] = component
        .instance()
        .getSuccessMessage(recipientsBefore)
      expect(message).toEqual('Files.share.shareByEmail.success')
      expect(params).toEqual({ email: 'jon.snow@thewall.westeros' })
    })

    it('should return a success message and its params for one recipient with cozy', () => {
      component.setState({
        recipients: [
          {
            cozy: [
              {
                url: 'https://doranmartell.mycozy.cloud'
              }
            ]
          }
        ]
      })
      const recipientsBefore = props.currentRecipients
      const [message, params] = component
        .instance()
        .getSuccessMessage(recipientsBefore)
      expect(message).toEqual('Files.share.shareByEmail.success')
      expect(params).toEqual({ email: 'https://doranmartell.mycozy.cloud' })
    })

    it('should use generic success message if recipient has no email and no cozy', () => {
      component.setState({
        recipients: [
          {
            _id: 'fcb16b9e-7421'
          }
        ]
      })
      const recipientsBefore = props.currentRecipients
      const [message, params] = component
        .instance()
        .getSuccessMessage(recipientsBefore)
      expect(message).toEqual('Files.share.shareByEmail.genericSuccess')
      expect(params).toEqual({ count: 1 })
    })
  })
})

describe('countNewRecipients function', () => {
  const currentRecipients = [
    {
      email: 'arya.stark@winterfell.westeros'
    },
    {
      email: 'sansa.stark@winterfell.westeros'
    },
    {
      email: 'jon.snow@thewall.westeros'
    }
  ]
  const addedRecipients = [
    {
      id: '5d4916fa-e193',
      email: [
        {
          address: 'jon.snow@thewall.westeros',
          type: 'primary'
        }
      ]
    },
    {
      id: '4df64228-ce84',
      email: [
        {
          address: 'sansa.stark@winterfell.westeros',
          type: 'primary'
        }
      ]
    },
    {
      id: 'ff955bb1-f696',
      email: [
        {
          address: 'bran.stark@winterfell.westeros',
          type: 'primary'
        }
      ]
    }
  ]

  it('should count only the new recipients using email', () => {
    const result = countNewRecipients(currentRecipients, addedRecipients)
    expect(result).toEqual(1)
  })

  it('should count the new recipients when there are no current recipients', () => {
    const result = countNewRecipients([], addedRecipients)
    expect(result).toEqual(3)
  })

  it('should return 0 if there is no new recipients', () => {
    const currentRecipients = [
      {
        email: 'arya.stark@winterfell.westeros'
      },
      {
        email: 'sansa.stark@winterfell.westeros'
      },
      {
        email: 'jon.snow@thewall.westeros'
      },
      {
        email: 'bran.stark@winterfell.westeros'
      }
    ]
    const result = countNewRecipients(currentRecipients, addedRecipients)
    expect(result).toEqual(0)
  })

  it('should count the new recipients using cozy url', () => {
    const currentRecipients = [
      {
        instance: 'https://bran.mycozy.cloud'
      },
      {
        instance: 'https://jon.mycozy.cloud'
      }
    ]
    const addedRecipients = [
      {
        id: '5d4916fa-e193',
        cozy: [
          {
            url: 'https://jon.mycozy.cloud',
            type: 'primary'
          }
        ]
      },
      {
        id: '4df64228-ce84',
        cozy: [
          {
            url: 'https://sansa.mycozy.cloud',
            type: 'primary'
          }
        ]
      },
      {
        id: 'ff955bb1-f696',
        cozy: [
          {
            url: 'https://bran.mycozy.cloud',
            type: 'primary'
          }
        ]
      },
      {
        id: '0761944a-c740',
        cozy: [
          {
            url: 'https://arya.mycozy.cloud',
            type: 'primary'
          }
        ]
      }
    ]
    const result = countNewRecipients(currentRecipients, addedRecipients)
    expect(result).toEqual(2)
  })
})
