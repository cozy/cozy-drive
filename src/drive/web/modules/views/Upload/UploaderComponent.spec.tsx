import React from 'react'
import { render, RenderResult, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { DumbUpload } from 'drive/mobile/modules/upload'
import { generateForQueue } from 'drive/web/modules/views/Upload/UploadUtils'

jest.mock('cozy-keys-lib', () => ({
  withVaultClient: jest.fn().mockReturnValue({})
}))

const tSpy = jest.fn()
const uploadFilesFromNativeSpy = jest.fn()

describe('DumbUpload component', () => {
  const defaultItems = [
    {
      fileName: 'File1.pdf',
      mimeType: 'application/pdf',
      extension: 'pdf',
      contentUri: 'file:///path/to/file.pdf',
      filePath: '/path/to/file.pdf',
      weblink: null,
      text: null,
      subject: null,
      dirId: '123',
      conflictStrategy: 'replace'
    }
  ]

  const setupComponent = (): RenderResult => {
    const props = {
      client: {},
      vaultClient: {},
      t: tSpy,
      uploadFilesFromNative: uploadFilesFromNativeSpy,
      stopMediaBackup: jest.fn(),
      router: jest.fn(),
      navigate: jest.fn()
    }

    return render(<DumbUpload {...props} />)
  }

  describe('generateForQueue', () => {
    it('should generate the right object for the Drive queue', () => {
      const genetaredForQueue = generateForQueue(defaultItems)
      expect(genetaredForQueue).toEqual([
        { file: defaultItems[0], isDirectory: false }
      ])
    })
  })

  describe('Upload files', () => {
    it('should call uploadFileFromNative with the right arguments', async () => {
      const { rerender } = setupComponent()
      const folderId = 'io.cozy.root'

      rerender(<DumbUpload items={defaultItems} folder={{ _id: folderId }} />)

      await waitFor(() => {
        const genetaredForQueue = generateForQueue(defaultItems)
        expect(uploadFilesFromNativeSpy).toHaveBeenCalledWith(
          genetaredForQueue,
          folderId,
          expect.any(Function),
          { client: {}, vaultClient: {} }
        )
      })
    })
  })
})
