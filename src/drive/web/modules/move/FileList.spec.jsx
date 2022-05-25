import React from 'react'
import { render } from '@testing-library/react'
import { createMockClient } from 'cozy-client'
import { DOCTYPE_FILES_ENCRYPTION } from 'drive/lib/doctypes'
import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'
import FileList, { isInvalidMoveTarget } from 'drive/web/modules/move/FileList'

jest.mock('cozy-keys-lib', () => ({
  useVaultUnlockContext: jest
    .fn()
    .mockReturnValue({ showUnlockForm: jest.fn() })
}))
const client = createMockClient({})

const setup = ({ files, entries, navigateTo }) => {
  const root = render(
    <AppLike client={client}>
      <FileList files={files} entries={entries} navigateTo={navigateTo} />
    </AppLike>
  )

  return { root }
}

describe('FileList', () => {
  it('should display files', () => {
    const entries = [generateFile({ i: '1', type: 'file' })]
    const files = [
      generateFile({ i: '1', type: 'directory', prefix: '' }),
      generateFile({ i: '2', type: 'file', prefix: '' })
    ]

    const { root } = setup({ files, entries, navigateTo: () => null })
    const { queryAllByText } = root

    expect(queryAllByText('directory-1')).toBeTruthy()
    expect(queryAllByText('file-2')).toBeTruthy()
  })
})

describe('isInvalidMoveTarget', () => {
  it('should return true when target is a file', () => {
    const target = { _id: '1', type: 'file' }
    const entries = [{ _id: 'dir1', type: 'directory' }]
    expect(isInvalidMoveTarget(entries, target)).toBe(true)
  })

  it('should return true when subject is the target', () => {
    const target = { _id: '1', type: 'directory' }
    const entries = [{ _id: '1', type: 'directory' }]
    expect(isInvalidMoveTarget(entries, target)).toBe(true)
  })

  it('should return true when target is an encrypted directory and entries has non-encrypted folder', () => {
    const target = {
      _id: '1',
      type: 'directory',
      referenced_by: [{ type: DOCTYPE_FILES_ENCRYPTION, id: 'encrypted-key-1' }]
    }
    const entries = [{ _id: 'dir1', type: 'directory' }]
    expect(isInvalidMoveTarget(entries, target)).toBe(true)
  })

  it('shold return true when target is an encrypted dir and entries include both encrytped and non-encrypted dir', () => {
    const target = {
      _id: '1',
      type: 'directory',
      referenced_by: [{ type: DOCTYPE_FILES_ENCRYPTION, id: 'encrypted-key-1' }]
    }
    const entries = [
      {
        _id: 'dir1',
        type: 'directory',
        referenced_by: [
          { type: DOCTYPE_FILES_ENCRYPTION, id: 'encrypted-key-1' }
        ]
      },
      {
        _id: 'dir2',
        type: 'directory'
      }
    ]
    expect(isInvalidMoveTarget(entries, target)).toBe(true)
  })

  it('should return false when both target and entries are encrypted', () => {
    const target = {
      _id: '1',
      type: 'directory',
      referenced_by: [{ type: DOCTYPE_FILES_ENCRYPTION, id: 'encrypted-key-1' }]
    }
    const entries = [
      {
        _id: 'dir1',
        type: 'directory',
        referenced_by: [
          { type: DOCTYPE_FILES_ENCRYPTION, id: 'encrypted-key-1' }
        ]
      }
    ]
    expect(isInvalidMoveTarget(entries, target)).toBe(false)
  })

  it('should return false when both target and entries are regular folders', () => {
    const target = { _id: '1', type: 'directory' }
    const entries = [{ _id: 'dir1', type: 'directory' }]
    expect(isInvalidMoveTarget(entries, target)).toBe(false)
  })

  it('should return false when subject is a mix of regular file and folder and target a regular folder', () => {
    const target = { _id: '1', type: 'directory' }
    const entries = [
      { _id: 'dir1', type: 'file' },
      { _id: 'file1', type: 'file' }
    ]
    expect(isInvalidMoveTarget(entries, target)).toBe(false)
  })
})
