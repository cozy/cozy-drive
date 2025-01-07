import { render, fireEvent, screen } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'

import AppLike from 'test/components/AppLike'

import { FolderPicker } from '@/components/FolderPicker/FolderPicker'

jest.mock('cozy-keys-lib', () => ({
  useVaultClient: jest.fn()
}))

jest.mock('cozy-sharing', () => ({
  ...jest.requireActual('cozy-sharing'),
  useSharingContext: jest.fn()
}))

useSharingContext.mockReturnValue({ byDocId: [] })

describe('FolderPicker', () => {
  const cozyFile = {
    id: 'file123',
    _id: 'file123',
    _type: 'io.cozy.files',
    dir_id: 'folder123',
    name: 'penguins.jpg'
  }

  const cozyFolder = {
    id: 'folder123',
    _id: 'folder123',
    _type: 'io.cozy.files',
    dir_id: 'io.cozy.files.root-dir',
    name: 'Photos'
  }

  const rootCozyFolder = {
    id: 'io.cozy.files.root-dir',
    _id: 'io.cozy.files.root-dir',
    _type: 'io.cozy.files'
  }

  const onCloseSpy = jest.fn()
  const onConfirmSpy = jest.fn()

  const setup = () => {
    const mockClient = createMockClient({
      queries: {
        'onlyfolder-io.cozy.files.root-dir': {
          doctype: 'io.cozy.files',
          definition: {
            doctype: 'io.cozy.files',
            id: 'io.cozy.files.root-dir'
          },
          data: [rootCozyFolder]
        }
      }
    })

    return render(
      <AppLike client={mockClient}>
        <FolderPicker
          currentFolder={cozyFolder}
          entries={[cozyFile]}
          onClose={onCloseSpy}
          onConfirm={onConfirmSpy}
        />
      </AppLike>
    )
  }

  it('should be able to move inside another folder', async () => {
    setup()

    expect(screen.getByText('Photos')).toBeInTheDocument()

    const backButton = screen.getByRole('button', {
      name: 'Back'
    })
    fireEvent.click(backButton)
    await screen.findByText('Files')

    const moveButton = screen.queryByRole('button', {
      name: 'Move'
    })
    fireEvent.click(moveButton)
    expect(onConfirmSpy).toHaveBeenCalledWith(rootCozyFolder)
  })

  it('should display the folder creation input', async () => {
    setup()

    const addFolderButton = screen.queryByRole('button', {
      name: 'Add a folder'
    })
    fireEvent.click(addFolderButton)

    const filenameInput = await screen.findByTestId('name-input')
    expect(filenameInput).toBeInTheDocument()
  })
})
