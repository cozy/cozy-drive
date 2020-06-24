import getFolderPath from './getFolderPath'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'

describe('Computing a folders path', () => {
  describe('in the drive view', () => {
    const location = '/drive'

    it('should handle the path for the root folder', () => {
      const currentFolder = {
        id: ROOT_DIR_ID,
        parent: false
      }
      const path = getFolderPath(currentFolder, location, false, [])
      expect(path.length).toEqual(1)
      expect(path[0]).toEqual(currentFolder)
    })

    it('should add the root folder if not present in the path', () => {
      const currentFolder = {
        id: '123',
        parent: false
      }
      const path = getFolderPath(currentFolder, location, false, [])
      expect(path.length).toEqual(2)
      expect(path[0].id).toEqual(ROOT_DIR_ID)
      expect(path[1]).toEqual(currentFolder)
    })

    it('should be ok when no displayed folder is provided', () => {
      const path = getFolderPath(null, location, false, [])

      expect(path.length).toEqual(1)
      expect(path[0].id).toEqual(ROOT_DIR_ID)
    })

    it('should add the parent to the path', () => {
      const currentFolder = {
        id: '123',
        parent: {
          id: '456'
        }
      }
      const path = getFolderPath(currentFolder, location, false, [])

      expect(path.length).toEqual(3)
      expect(path[0].id).toEqual(ROOT_DIR_ID)
      expect(path[1]).toEqual(currentFolder.parent)
      expect(path[2]).toEqual(currentFolder)
    })

    it("should add the parent's parent to the path", () => {
      const currentFolder = {
        id: '123',
        parent: {
          id: '456',
          dir_id: '789'
        }
      }
      const path = getFolderPath(currentFolder, location, false, [])

      expect(path.length).toEqual(4)
      expect(path[0].id).toEqual(ROOT_DIR_ID)
      expect(path[1].id).toEqual(currentFolder.parent.dir_id)
      expect(path[2]).toEqual(currentFolder.parent)
      expect(path[3]).toEqual(currentFolder)
    })
  })

  describe('in a public view', () => {
    const location = '/drive'

    it('should not add the root folder', () => {
      const currentFolder = {
        id: '123',
        parent: false
      }
      const path = getFolderPath(currentFolder, location, true, [])
      expect(path.length).toEqual(1)
      expect(path[0]).toEqual(currentFolder)
    })

    it('should not add the parents parent', () => {
      const currentFolder = {
        id: '123',
        parent: {
          id: '456',
          dir_id: '789'
        }
      }
      const path = getFolderPath(currentFolder, location, true, [])

      expect(path.length).toEqual(2)
      expect(path[0]).toEqual(currentFolder.parent)
      expect(path[1]).toEqual(currentFolder)
    })
  })

  describe('in the trash view', () => {
    const currentView = 'trash'

    it('should handle the trash root folder', () => {
      const currentFolder = {
        id: TRASH_DIR_ID
      }
      const path = getFolderPath(currentFolder, currentView, false, [])

      expect(path.length).toEqual(1)
      expect(path[0]).toEqual(currentFolder)
    })

    it('should add the fake trash folder as root', () => {
      const currentFolder = {
        id: '123',
        parent: false
      }
      const path = getFolderPath(currentFolder, currentView, false, [])
      expect(path.length).toEqual(2)
      expect(path[0].id).toEqual(TRASH_DIR_ID)
      expect(path[1]).toEqual(currentFolder)
    })

    it('should not add the root parent to the path', () => {
      const currentFolder = {
        id: '123',
        parent: {
          id: ROOT_DIR_ID
        }
      }
      const path = getFolderPath(currentFolder, currentView, false, [])
      expect(path.length).toEqual(2)
      expect(path[0].id).toEqual(TRASH_DIR_ID)
      expect(path[1]).toEqual(currentFolder)
    })

    it('should not add the root grand parent to the path', () => {
      const currentFolder = {
        id: '123',
        parent: {
          id: '456',
          dir_id: ROOT_DIR_ID
        }
      }
      const path = getFolderPath(currentFolder, currentView, false, [])
      expect(path.length).toEqual(3)
      expect(path[0].id).toEqual(TRASH_DIR_ID)
      expect(path[1]).toEqual(currentFolder.parent)
      expect(path[2]).toEqual(currentFolder)
    })
  })

  describe('in the recent view', () => {
    it('should not add the root folder', () => {
      const currentFolder = {
        id: '123',
        parent: false
      }
      const path = getFolderPath(currentFolder, '/recent', true, [])
      expect(path.length).toEqual(1)
      expect(path[0]).toEqual(currentFolder)
    })
  })

  describe('in the sharings view', () => {
    const currentView = 'sharings'

    it('should not add the root folder', () => {
      const currentFolder = {
        id: '123',
        parent: false
      }
      const path = getFolderPath(currentFolder, currentView, true, [])
      expect(path.length).toEqual(1)
      expect(path[0]).toEqual(currentFolder)
    })

    it('should add the parent of a regular folder', () => {
      const currentFolder = {
        id: '123',
        parent: {
          id: '456'
        }
      }
      const path = getFolderPath(currentFolder, currentView, true, [])
      expect(path.length).toEqual(2)
      expect(path[0]).toEqual(currentFolder.parent)
      expect(path[1]).toEqual(currentFolder)
    })

    it('should not add the parent of a shared folder', () => {
      const currentFolder = {
        id: '123',
        parent: {
          id: '456'
        }
      }
      const path = getFolderPath(currentFolder, currentView, true, ['123'])
      expect(path.length).toEqual(1)
      expect(path[0]).toEqual(currentFolder)
    })

    it("should not add the parent of a shared folder's parent", () => {
      const currentFolder = {
        id: '123',
        parent: {
          id: '456',
          dir_id: '789'
        }
      }
      const path = getFolderPath(currentFolder, currentView, true, ['456'])
      expect(path.length).toEqual(2)
      expect(path[0]).toEqual(currentFolder.parent)
      expect(path[1]).toEqual(currentFolder)
    })
  })
})
