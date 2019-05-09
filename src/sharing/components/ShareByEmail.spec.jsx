import React from 'react'
import { mount } from 'enzyme'

import ShareByEmail from './ShareByEmail'

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
          { email: 'arya.stark@winterfell.westeros' }
        ]
      })
      const [message, params] = component.instance().getSuccessMessage()
      expect(message).toEqual('Files.share.shareByEmail.genericSuccess')
      expect(params).toEqual({ count: 2 })
    })

    it('should return a success message and its params for one recipient with email', () => {
      component.setState({
        recipients: [{ email: 'jon.snow@thewall.westeros' }]
      })
      const [message, params] = component.instance().getSuccessMessage()
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
      const [message, params] = component.instance().getSuccessMessage()
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
      const [message, params] = component.instance().getSuccessMessage()
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
      const [message, params] = component.instance().getSuccessMessage()
      expect(message).toEqual('Files.share.shareByEmail.genericSuccess')
      expect(params).toEqual({ count: 1 })
    })
  })
})
