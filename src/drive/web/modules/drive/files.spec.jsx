import { isNote } from './files'
describe('Files Helper', () => {
  it('should test if a file is a note or not', () => {
    const file = {
      type: 'file',
      _id: 1
    }
    expect(isNote(file)).toBe(false)
    const note = {
      type: 'file',
      name: 'test.cozy-note',
      metadata: {
        content: 'content',
        schema: [],
        title: 'title',
        version: '0'
      }
    }
    expect(isNote(note)).toBe(true)
  })
})
