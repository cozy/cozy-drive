import * as matchers from './suggestionMatchers'

describe('Suggestion matchers', () => {
  describe('emailMatch', () => {
    it('should return true if one email matches', () => {
      const contact = {
        fullname: 'Jon Snow',
        email: [
          {
            address: 'jon@winterfell.westeros',
            type: 'Home',
            primary: true
          },
          {
            address: 'jon.snow@thewall.westeros',
            type: 'Work',
            primary: true
          }
        ]
      }
      const result = matchers.emailMatch('jon.snow@thewall.westeros', contact)
      expect(result).toBe(true)
    })

    it('should return false if no email matches', () => {
      const contact = {
        fullname: 'Jon Snow',
        email: [
          {
            address: 'jon@winterfell.westeros',
            type: 'Home',
            primary: true
          },
          {
            address: 'jon.snow@thewall.westeros',
            type: 'Work',
            primary: true
          }
        ]
      }
      const result = matchers.emailMatch('jon@thewall.westeros', contact)
      expect(result).toBe(false)
    })

    it('should return false if contact has no email', () => {
      const contact = {
        fullname: 'Jon Snow',
        email: []
      }
      const result = matchers.emailMatch('jon.snow@thewall.westeros', contact)
      expect(result).toBe(false)
    })
  })
})
