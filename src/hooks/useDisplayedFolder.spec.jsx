import { useQuery } from 'cozy-client'

import useCurrentFolderId from './useCurrentFolderId'
import useDisplayedFolder from './useDisplayedFolder'
import { ROOT_DIR_ID } from '@/constants/config'

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

  it("should return root dir if current folder isn't found", () => {
    const FOLDER = {
      id: ROOT_DIR_ID,
      name: 'Root'
    }

    useQuery.mockReturnValue({ data: FOLDER })
    useCurrentFolderId.mockReturnValue(null)

    const { displayedFolder } = useDisplayedFolder()

    expect(displayedFolder).toBe(FOLDER)
  })
})
