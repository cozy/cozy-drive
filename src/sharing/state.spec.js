import { matchingInstanceName } from './state'

describe('finding matching instance names', () => {
  const instanceURI = 'https://yes.com'

  it('should work in a simple case', () => {
    const members = [{ instance: instanceURI }, { instance: 'https://no.com' }]
    expect(members.find(matchingInstanceName(instanceURI))).toEqual(members[0])
  })

  it('should match instance names with a different casing', () => {
    const members = [
      { instance: 'https://no.com' },
      { instance: 'https://YES.COM' }
    ]
    expect(members.find(matchingInstanceName(instanceURI))).toEqual(members[1])
  })
})
