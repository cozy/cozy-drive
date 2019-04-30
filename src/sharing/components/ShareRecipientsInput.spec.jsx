import React from 'react'
import { shallow } from 'enzyme'

import ShareRecipientsInput from './ShareRecipientsInput'

describe('ShareRecipientsInput component', () => {
  it('should match snapshot', () => {
    const props = {
      label: 'Recipients',
      contacts: {
        id: 'contacts',
        fetchStatus: 'loaded',
        hasMore: false,
        data: [
          {
            id: 'df563cc4-6440',
            name: {
              givenName: 'Michale',
              familyName: 'Russel'
            }
          },
          {
            id: '5a3b4ccf-c257',
            name: {
              givenName: 'Teagan',
              familyName: 'Wolf'
            }
          }
        ]
      },
      groups: {
        id: 'groups',
        fetchStatus: 'loaded',
        hasMore: false,
        data: [
          { id: 'fe86af20-c6c5', name: "The Night's Watch" },
          { id: '3d8193ab-2ce4', name: 'The North' }
        ]
      },
      recipients: [
        {
          id: '5a3b4ccf-c257',
          name: {
            givenName: 'Teagan',
            familyName: 'Wolf'
          }
        }
      ],
      onPick: jest.fn().mockName('onPick'),
      onRemove: jest.fn().mockName('onRemove'),
      placeholder: 'Enter recipients here'
    }
    const jsx = <ShareRecipientsInput {...props} />
    const wrapper = shallow(jsx)
    expect(wrapper).toMatchSnapshot()
  })

  it('should include groups only if all contacts are loaded', () => {
    const props = {
      label: 'Recipients',
      contacts: {
        id: 'contacts',
        fetchStatus: 'loading',
        hasMore: false,
        data: [
          {
            id: 'df563cc4-6440',
            name: {
              givenName: 'Michale',
              familyName: 'Russel'
            }
          },
          {
            id: '5a3b4ccf-c257',
            name: {
              givenName: 'Teagan',
              familyName: 'Wolf'
            }
          }
        ]
      },
      groups: {
        id: 'groups',
        fetchStatus: 'loaded',
        hasMore: false,
        data: [
          { id: 'fe86af20-c6c5', name: "The Night's Watch" },
          { id: '3d8193ab-2ce4', name: 'The North' }
        ]
      },
      recipients: [
        {
          id: '5a3b4ccf-c257',
          name: {
            givenName: 'Teagan',
            familyName: 'Wolf'
          }
        }
      ],
      onPick: jest.fn().mockName('onPick'),
      onRemove: jest.fn().mockName('onRemove'),
      placeholder: 'Enter recipients here'
    }
    const jsx = <ShareRecipientsInput {...props} />
    const wrapper = shallow(jsx)
    expect(wrapper).toMatchSnapshot()
  })
})
