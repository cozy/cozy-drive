import Contact from 'models/Contact'

describe('Contact model', () => {
  describe('getInitials method', () => {
    it('should return the first letter of public_name if it is an owner recipient', () => {
      const recipient = {
        name: 'whatever',
        public_name: 'janedoe'
      }
      const result = Contact.getInitials(recipient)
      expect(result).toEqual('J')
    })

    it('should return the first letter of name if it is a recipient', () => {
      const recipient = {
        name: 'janedoe'
      }
      const result = Contact.getInitials(recipient)
      expect(result).toEqual('J')
    })

    it('should return an empty string if name/public_name are undefined', () => {
      const recipient = {}
      const result = Contact.getInitials(recipient)
      expect(result).toEqual('')
    })

    it('should use the original implementation if a contact is given', () => {
      const contact = {
        _id: '46b5d129-0296-4466-8c02-9a6a0c17c4cb',
        _type: 'io.cozy.contacts',
        name: {
          givenName: 'Arya',
          familyName: 'Stark'
        }
      }
      const result = Contact.getInitials(contact)
      expect(result).toEqual('AS')
    })
  })

  describe('getDisplayName method', () => {
    it('should use the original implementation if a contact is given', () => {
      const contact = {
        _id: '46b5d129-0296-4466-8c02-9a6a0c17c4cb',
        _type: 'io.cozy.contacts',
        fullname: 'Arya Stark',
        name: {
          givenName: 'Arya',
          familyName: 'Stark'
        }
      }
      const result = Contact.getDisplayName(contact)
      expect(result).toEqual('Arya Stark')
    })

    it('should use name if a recipient is given', () => {
      const contact = {
        name: 'Arya Stark'
      }
      const result = Contact.getDisplayName(contact)
      expect(result).toEqual('Arya Stark')
    })

    it('should use email if a recipient is given', () => {
      const recipient = {
        email: 'arya.stark@winterfell.westeros'
      }
      const result = Contact.getDisplayName(recipient)
      expect(result).toEqual('arya.stark@winterfell.westeros')
    })
  })
})
