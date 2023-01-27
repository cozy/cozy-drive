import useDisplayedFolder from './useDisplayedFolder'
import useCurrentFolderId from './useCurrentFolderId'

const mockGetDocumentFromState = jest.fn()

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  useClient: () => ({
    getDocumentFromState: mockGetDocumentFromState
  })
}))

jest.mock('./useCurrentFolderId')

describe('useDisplayedFolder', () => {
  it('should return file folder if current folder exists', () => {
    const FOLDER = {
      id: 'folder-id',
      name: 'Folder name'
    }
    mockGetDocumentFromState.mockReturnValue(FOLDER)
    useCurrentFolderId.mockReturnValue(FOLDER.id)

    const displayedFolder = useDisplayedFolder()

    expect(displayedFolder).toBe(FOLDER)
  })

  it('should return null if current folder does not exist', () => {
    useCurrentFolderId.mockReturnValue(null)

    const displayedFolder = useDisplayedFolder()

    expect(displayedFolder).toBe(null)
  })
})
