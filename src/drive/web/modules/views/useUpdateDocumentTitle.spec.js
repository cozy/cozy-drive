import { makeTitle } from './useUpdateDocumentTitle'
import { TRASH_DIR_PATH } from 'drive/constants/config'
import Polyglot from 'node-polyglot'
import en from 'drive/locales/en.json'

const p = new Polyglot()
p.extend(en)
const t = p.t.bind(p)

describe('makeTitle', () => {
  describe('for files', () => {
    it('should show only the app name', () => {
      expect(makeTitle({}, 'Cozy Drive', t)).toBe('Cozy Drive')
    })

    it('should show the file name and app name', () => {
      expect(makeTitle({ name: 'file.docx' }, 'Cozy Drive', t)).toBe(
        'file.docx - Cozy Drive'
      )
    })

    it('should show the folder name and app name', () => {
      expect(
        makeTitle({ displayedPath: '/folder/subFolder' }, 'Cozy Drive', t)
      ).toBe('(folder/subFolder) - Cozy Drive')
    })

    it('should show the file name, folder name and app name', () => {
      expect(
        makeTitle(
          { name: 'file.docx', displayedPath: '/folder/subFolder' },
          'Cozy Drive',
          t
        )
      ).toBe('file.docx (folder/subFolder) - Cozy Drive')
    })

    it('should show trash folder with human frendly name', () => {
      expect(
        makeTitle(
          { name: 'file.docx', displayedPath: `${TRASH_DIR_PATH}/folder` },
          'Cozy Drive',
          t
        )
      ).toBe('file.docx (Trash/folder) - Cozy Drive')
    })

    it('should show trash folder with human frendly name even if no subdirectory', () => {
      expect(
        makeTitle(
          { name: 'file.docx', displayedPath: TRASH_DIR_PATH },
          'Cozy Drive',
          t
        )
      ).toBe('file.docx (Trash) - Cozy Drive')
    })
  })

  describe('for folders', () => {
    it('should show trash folder with human frendly name even if no subdirectory', () => {
      expect(
        makeTitle(
          { type: 'directory', name: '.cozy_trash', path: TRASH_DIR_PATH },
          'Cozy Drive',
          t
        )
      ).toBe('Trash - Cozy Drive')
    })

    it('should show trash folder with human frendly name', () => {
      expect(
        makeTitle(
          {
            type: 'directory',
            name: 'folder',
            path: `${TRASH_DIR_PATH}/folder`
          },
          'Cozy Drive',
          t
        )
      ).toBe('folder (Trash/folder) - Cozy Drive')
    })

    it('should show folder path and app name', () => {
      expect(
        makeTitle(
          { type: 'directory', name: 'subfolder', path: '/folder/subfolder' },
          'Cozy Drive',
          t
        )
      ).toBe('subfolder (folder/subfolder) - Cozy Drive')
    })

    it('should show only app name for root directory', () => {
      expect(
        makeTitle({ type: 'directory', name: '', path: '/' }, 'Cozy Drive', t)
      ).toBe('Cozy Drive')
    })

    it('should not show the path for first level folders', () => {
      expect(
        makeTitle(
          { type: 'directory', name: 'folder', path: '/folder' },
          'Cozy Drive',
          t
        )
      ).toBe('folder - Cozy Drive')
    })
  })
})
