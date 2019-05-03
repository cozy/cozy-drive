import React from 'react'
import { shallow } from 'enzyme'

import { ContactSuggestion } from './ContactSuggestion'

describe('ContactSuggestion component', () => {
  const fakeT = jest.fn((s, args) => {
    if (s === 'Share.members.count') {
      return `${args.smart_count} members`
    }

    return s
  })
  it('should display contact suggestion for a contact', () => {
    const jonSnow = {
      _id: 'f3a4e501-abbd',
      fullname: 'Jon Snow',
      name: {
        givenName: 'Jon',
        familyName: 'Snow'
      },
      cozy: [
        {
          primary: true,
          url: 'https://jonsnow.mycozy.cloud'
        }
      ],
      email: [
        {
          address: 'jon.snow@email.com',
          type: 'primary'
        }
      ],
      _type: 'io.cozy.contacts'
    }
    const contacts = [jonSnow]
    const props = {
      contactOrGroup: jonSnow,
      contacts,
      t: fakeT
    }
    const jsx = <ContactSuggestion {...props} />
    const wrapper = shallow(jsx)
    expect(wrapper).toMatchSnapshot()
  })

  it('should display contact suggestion for a contact without fullname (for example created by a share modal)', () => {
    const jonSnow = {
      _id: 'f3a4e501-abbd',
      cozy: [],
      email: [
        {
          address: 'jon.snow@email.com',
          type: 'primary'
        }
      ],
      name: undefined,
      _type: 'io.cozy.contacts'
    }
    const contacts = [jonSnow]
    const props = {
      contactOrGroup: jonSnow,
      contacts,
      t: fakeT
    }
    const jsx = <ContactSuggestion {...props} />
    const wrapper = shallow(jsx)
    expect(wrapper).toMatchSnapshot()
  })

  it('should display contact suggestion for a group', () => {
    const jon = {
      _id: 'f3a4e501-abbd',
      fullname: 'Jon Snow',
      name: {
        givenName: 'Jon',
        familyName: 'Snow'
      },
      email: [
        {
          address: 'jon.snow@email.com',
          type: 'primary'
        }
      ],
      _type: 'io.cozy.contacts',
      relationships: {
        groups: {
          data: [{ _id: '610718e6-2d7a' }]
        }
      }
    }
    const cersei = {
      _id: '42dc490a-7878',
      fullname: 'Cersei Lannister',
      name: {
        givenName: 'Cersei',
        familyName: 'Lannister'
      },
      email: [
        {
          address: 'cersei@email.com',
          type: 'primary'
        }
      ],
      _type: 'io.cozy.contacts',
      relationships: { groups: { data: [] } }
    }
    const sam = {
      _id: 'b5bed853-93da',
      fullname: 'Samwell Tarly',
      name: {
        givenName: 'Samwell',
        familyName: 'Tarly'
      },
      email: [
        {
          address: 'samwell@email.com',
          type: 'primary'
        }
      ],
      _type: 'io.cozy.contacts',
      relationships: {
        groups: {
          data: [{ _id: '610718e6-2d7a' }]
        }
      }
    }
    const contacts = [jon, cersei, sam]
    const theNightsWatch = {
      _id: '610718e6-2d7a',
      name: "The Night's Watch",
      _type: 'io.cozy.contacts.groups'
    }
    const props = {
      contactOrGroup: theNightsWatch,
      contacts,
      t: fakeT
    }
    const jsx = <ContactSuggestion {...props} />
    const wrapper = shallow(jsx)
    expect(wrapper).toMatchSnapshot()
  })
})
