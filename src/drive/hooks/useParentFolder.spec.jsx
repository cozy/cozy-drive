import useParentFolder from './useParentFolder'

const mockGetDocumentFromState = jest.fn()

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  useClient: () => ({
    getDocumentFromState: mockGetDocumentFromState
  })
}))

describe('useParentFolder', () => {
  it('should return file folder if parent folder exists', () => {
    const FOLDER = {
      id: 'folder-id',
      name: 'Folder name'
    }
    mockGetDocumentFromState.mockReturnValue(FOLDER)

    const parentFolder = useParentFolder(FOLDER.id)

    expect(parentFolder).toBe(FOLDER)
  })

  it('should return null if parent folder does not exist', () => {
    const parentFolder = useParentFolder()

    expect(parentFolder).toBe(null)
  })
})
