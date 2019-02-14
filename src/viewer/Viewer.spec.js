import { isPlainText } from './Viewer'

describe('Plain text file detection', () => {
  describe('using mime types', () => {
    it('should match mime types starting with "text/"', () => {
      expect(isPlainText('text/plain')).toBe(true)
      expect(isPlainText('text/markdown')).toBe(true)
      expect(isPlainText('application/text')).toBe(false)
      expect(isPlainText('something/text/else')).toBe(false)
    })

    it('should not match complex text formats', () => {
      expect(isPlainText('application/msword')).toBe(false)
      expect(isPlainText('application/vnd.oasis.opendocument.text')).toBe(false)
      expect(isPlainText('application/x-iwork-pages-sffpages')).toBe(false)
    })

    it('should not use the filename if a mime type is present', () => {
      expect(isPlainText('application/msword', 'iswearitstext.txt')).toBe(false)
    })
  })
  describe('using file names', () => {
    it('should match txt files', () => {
      expect(isPlainText(undefined, 'iswearitstext.txt')).toBe(true)
    })

    it('should match md files', () => {
      expect(isPlainText(undefined, 'markdown.md')).toBe(true)
    })

    it('should not match anything else', () => {
      expect(isPlainText(undefined, 'file.doc')).toBe(false)
      expect(isPlainText(undefined, 'file.docx')).toBe(false)
      expect(isPlainText(undefined, 'file.pages')).toBe(false)
      expect(isPlainText(undefined, 'file.odt')).toBe(false)
      expect(isPlainText(undefined, 'file.csv')).toBe(false)
      expect(isPlainText(undefined, 'file.vcf')).toBe(false)
    })
  })
})
