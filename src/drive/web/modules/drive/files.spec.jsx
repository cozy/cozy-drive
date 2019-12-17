import { isNoteMine } from './files'
describe('files helper', () => {
  it('should tell if the note is mine or not', () => {
    const client = {
      getStackClient: () => ({
        uri: 'http://cozy.tools'
      })
    }
    const myNote = {
      cozyMetadata: {
        createdOn: 'http://cozy.tools/'
      }
    }
    const sharedNote = {
      cozyMetadata: {
        createdOn: 'http://q.cozy.tools/'
      }
    }
    expect(isNoteMine(myNote, client)).toBe(true)
    expect(isNoteMine(sharedNote, client)).toBe(false)
  })
})
