import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { createMockClient } from 'cozy-client'

import { CozyFile } from 'models'
import { MoveModal } from './MoveModal'
import AppLike from 'test/components/AppLike'
import useDisplayedFolder from 'hooks/useDisplayedFolder'
import { useSharingContext } from 'cozy-sharing'
import { ROOT_DIR_ID } from 'constants/config'

jest.mock('hooks/useDisplayedFolder')
jest.mock('cozy-sharing', () => ({
  ...jest.requireActual('cozy-sharing'),
  useSharingContext: jest.fn()
}))

jest.mock('cozy-client/dist/utils', () => ({
  cancelable: jest.fn().mockImplementation(promise => promise)
}))

jest.mock('cozy-doctypes')
CozyFile.doctype = 'io.cozy.files'
const onCloseSpy = jest.fn()
const refreshSpy = jest.fn()

CozyFile.splitFilename.mockImplementation(({ name }) => ({
  filename: name,
  extension: ''
}))

describe('MoveModal component', () => {
  const defaultEntries = [
    {
      _id: 'bill_201901',
      dir_id: 'bills',
      name: 'bill_201901.pdf',
      path: '/bills/bill_201901.pdf'
    },
    {
      _id: 'bill_201902',
      dir_id: 'bills',
      name: 'bill_201902.pdf',
      path: '/bills/bill_201902.pdf'
    },
    // shared file:
    {
      _id: 'bill_201903',
      dir_id: 'bills',
      name: 'bill_201903.pdf',
      path: '/bills/bill_201903.pdf'
    }
  ]

  const setup = ({
    entries = defaultEntries,
    displayedFolderId = 'destinationFolder',
    sharedPaths = ['/sharedFolder'],
    byDocId = {},
    getSharedParentPath = () => null,
    allLoaded = true,
    sharingContext = {}
  } = {}) => {
    const props = {
      entries,
      onClose: onCloseSpy,
      classes: { paper: {} }
    }

    useDisplayedFolder.mockReturnValue({
      displayedFolder: { _id: displayedFolderId }
    })

    useSharingContext.mockReturnValue({
      sharedPaths,
      refresh: refreshSpy,
      getSharedParentPath,
      hasSharedParent: path =>
        sharedPaths.filter(sharedPath => path.includes(sharedPath)).length > 0,
      byDocId,
      allLoaded,
      ...sharingContext
    })

    const mockClient = createMockClient({
      queries: {
        'moveOrImport-destinationFolder': {
          doctype: 'io.cozy.files',
          data: []
        },
        'onlyfolder-destinationFolder': {
          doctype: 'io.cozy.files',
          data: [
            {
              _id: 'destinationFolder',
              dir_id: ROOT_DIR_ID,
              name: 'Destination Folder',
              type: 'directory'
            }
          ]
        },
        'io.cozy.files/path/bills': {
          doctype: 'io.cozy.files',
          data: [
            {
              _id: 'bills',
              dir_id: ROOT_DIR_ID,
              name: 'Bills',
              type: 'directory'
            }
          ]
        }
      }
    })

    CozyFile.getFullpath.mockImplementation(
      (destinationFolder, name) => `/${destinationFolder}/${name}`
    )

    CozyFile.move.mockImplementation(id => {
      if (id === 'bill_201902') {
        return Promise.resolve({
          deleted: 'other_bill_201902',
          moved: { id }
        })
      } else {
        return Promise.resolve({
          deleted: null,
          moved: { id }
        })
      }
    })

    return render(
      <AppLike client={mockClient}>
        <MoveModal {...props} />
      </AppLike>
    )
  }

  describe('MoveModal', () => {
    it('should wait for shares to load before authorising moves', async () => {
      setup({ allLoaded: false })

      const moveButton = await screen.findByRole('button', {
        name: 'Move',
        busy: true
      })
      expect(moveButton).toBeDisabled()
    })

    it('should move entries to destination', async () => {
      CozyFile.getFullpath.mockImplementation((destinationFolder, name) =>
        Promise.resolve(
          name === 'bill_201903.pdf' ? '/bills/bill_201903.pdf' : '/whatever'
        )
      )

      setup()

      const moveButton = await screen.findByText('Move')
      fireEvent.click(moveButton)

      await waitFor(() => {
        expect(CozyFile.move).toHaveBeenNthCalledWith(
          1,
          'bill_201901',
          {
            folderId: 'destinationFolder'
          },
          true
        )

        expect(CozyFile.move).toHaveBeenNthCalledWith(
          2,
          'bill_201902',
          {
            folderId: 'destinationFolder'
          },
          true
        )
        // don't force a shared file
        expect(CozyFile.move).toHaveBeenNthCalledWith(
          3,
          'bill_201903',
          {
            folderId: 'destinationFolder'
          },
          true
        )
        expect(onCloseSpy).toHaveBeenCalled()
        expect(refreshSpy).toHaveBeenCalled()
        // TODO: check that trashedFiles are passed to cancel button
      })
    })

    it('should display the folder creation input', async () => {
      setup()

      const addButton = await screen.findByLabelText('Add a folder')
      fireEvent.click(addButton)

      const filenameInput = await screen.findByTestId('name-input')
      expect(filenameInput).toBeInTheDocument()
    })
  })

  describe('move outside shared folder', () => {
    it('should display an alert when moving files outside a shared folder', async () => {
      setup({
        sharedPaths: ['/bills'],
        getSharedParentPath: () => '/bills'
      })

      const moveButton = await screen.findByText('Move')
      fireEvent.click(moveButton)

      await waitFor(() => {
        expect(
          screen.getByText('Moving outside the Bills folder')
        ).toBeInTheDocument()
      })
    })

    it('should move files when user confirms', async () => {
      setup({
        sharedPaths: ['/bills'],
        getSharedParentPath: () => '/bills'
      })

      const moveButton = await screen.findByText('Move')
      fireEvent.click(moveButton)

      await waitFor(() => {
        const confirmButton = screen.getByText('I understand')
        fireEvent.click(confirmButton)
      })

      await waitFor(() => {
        expect(CozyFile.move).toHaveBeenCalled()
        expect(onCloseSpy).toHaveBeenCalled()
        expect(refreshSpy).toHaveBeenCalled()
      })
    })
  })

  describe('move inside shared folder', () => {
    it('should display an alert when moving files inside a shared folder', async () => {
      setup({
        sharedPaths: ['/destinationFolder'],
        getSharedParentPath: () => '/bills'
      })

      const moveButton = await screen.findByText('Move')
      fireEvent.click(moveButton)

      const modalTitle = await screen.findByText('Move to a shared folder?')
      expect(modalTitle).toBeInTheDocument()
    })

    it('should move files when user confirms', async () => {
      setup({
        sharedPaths: ['/destinationFolder'],
        getSharedParentPath: () => '/bills'
      })

      const moveButton = await screen.findByText('Move')
      fireEvent.click(moveButton)

      const confirmButton = await screen.findByText('Ok')
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(CozyFile.move).toHaveBeenCalled()
        expect(onCloseSpy).toHaveBeenCalled()
        expect(refreshSpy).toHaveBeenCalled()
      })
    })
  })

  describe('move shared folder inside another', () => {
    it('should display an alert when move shared folder inside another', async () => {
      CozyFile.getFullpath.mockImplementation((destinationFolder, name) =>
        Promise.resolve(`/${destinationFolder}/${name}`)
      )

      setup({
        sharedPaths: ['/bills/bill_201903.pdf', '/destinationFolder'],
        byDocId: {
          bill_201903: {
            permissions: [],
            sharings: []
          }
        },
        getSharedParentPath: () => null
      })

      const moveButton = await screen.findByText('Move')
      fireEvent.click(moveButton)

      await waitFor(() => {
        expect(screen.getByText('Cannot be moved')).toBeInTheDocument()
      })
    })

    it('should move files after revoke all recipients when folder owner confirms', async () => {
      CozyFile.getFullpath.mockImplementation((destinationFolder, name) =>
        Promise.resolve(`/${destinationFolder}/${name}`)
      )
      const revokeAllSpy = jest.fn()
      const revokeSelfSpy = jest.fn()

      setup({
        sharedPaths: ['/bills/bill_201903.pdf', '/destinationFolder'],
        byDocId: {
          bill_201903: {
            permissions: [],
            sharings: []
          }
        },
        getSharedParentPath: () => null,
        sharingContext: {
          isOwner: () => true,
          revokeAllRecipients: revokeAllSpy,
          revokeSelf: revokeSelfSpy
        }
      })

      const moveButton = await screen.findByText('Move')
      fireEvent.click(moveButton)

      await waitFor(() => {
        const confirmButton = screen.getByText('Stop sharing')
        fireEvent.click(confirmButton)
      })

      await waitFor(() => {
        expect(CozyFile.move).toHaveBeenCalled()
        expect(revokeAllSpy).toHaveBeenCalled()
        expect(revokeSelfSpy).not.toHaveBeenCalled()
        expect(onCloseSpy).toHaveBeenCalled()
        expect(refreshSpy).toHaveBeenCalled()
      })
    })

    it('should move files after revoke self when user confirms', async () => {
      CozyFile.getFullpath.mockImplementation((destinationFolder, name) =>
        Promise.resolve(`/${destinationFolder}/${name}`)
      )
      const revokeAllSpy = jest.fn()
      const revokeSelfSpy = jest.fn()

      setup({
        sharedPaths: ['/bills/bill_201903.pdf', '/destinationFolder'],
        byDocId: {
          bill_201903: {
            permissions: [],
            sharings: []
          }
        },
        getSharedParentPath: () => null,
        sharingContext: {
          isOwner: () => false,
          revokeAllRecipients: revokeAllSpy,
          revokeSelf: revokeSelfSpy
        }
      })

      const moveButton = await screen.findByText('Move')
      fireEvent.click(moveButton)

      await waitFor(() => {
        const confirmButton = screen.getByText('Stop sharing')
        fireEvent.click(confirmButton)
      })

      await waitFor(() => {
        expect(CozyFile.move).toHaveBeenCalled()
        expect(revokeSelfSpy).toHaveBeenCalled()
        expect(revokeAllSpy).not.toHaveBeenCalled()
        expect(onCloseSpy).toHaveBeenCalled()
        expect(refreshSpy).toHaveBeenCalled()
      })
    })
  })
})
