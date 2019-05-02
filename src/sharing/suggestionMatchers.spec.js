import * as matchers from './suggestionMatchers'

describe('Suggestion matchers', () => {
  describe('cozyUrlMatch', () => {
    it('should return true if cozy url matches', () => {
      const contact = {
        fullname: 'Jon Snow',
        cozy: [
          {
            url: 'https://jon.mycozy.cloud'
          }
        ]
      }
      const result = matchers.cozyUrlMatch('https://jon.mycozy.cloud', contact)
      expect(result).toBe(true)
    })

    it("should return false if cozy url doesn't match", () => {
      const contact = {
        fullname: 'Jon Snow',
        cozy: [
          {
            url: 'https://jon.mycozy.cloud'
          }
        ]
      }
      const result = matchers.emailMatch(
        'https://jonsnow.mycozy.cloud',
        contact
      )
      expect(result).toBe(false)
    })

    it('should return false if contact has no cozy', () => {
      const contact = {
        fullname: 'Jon Snow',
        cozy: []
      }
      const result = matchers.emailMatch(
        'https://jonsnow.mycozy.cloud',
        contact
      )
      expect(result).toBe(false)
    })
  })

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
