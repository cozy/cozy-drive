import { useQuery } from 'cozy-client'

import useDisplayedFolder from './useDisplayedFolder'
import useCurrentFolderId from './useCurrentFolderId'

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  useQuery: jest.fn()
}))

jest.mock('./useCurrentFolderId')

describe('useDisplayedFolder', () => {
  it('should return file folder if current folder exists', () => {
    const FOLDER = {
      id: 'folder-id',
      name: 'Folder name'
    }
    useQuery.mockReturnValue({ data: FOLDER })
    useCurrentFolderId.mockReturnValue(FOLDER.id)

    const { displayedFolder } = useDisplayedFolder()

    expect(displayedFolder).toBe(FOLDER)
  })

  it('should return null if current folder does not exist', () => {
    useCurrentFolderId.mockReturnValue(null)

    const { displayedFolder } = useDisplayedFolder()

    expect(displayedFolder).toBe(null)
  })
})
