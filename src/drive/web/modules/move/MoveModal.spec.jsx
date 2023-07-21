import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { createMockClient } from 'cozy-client'

import { CozyFile } from 'models'
import { MoveModal } from './MoveModal'
import AppLike from 'test/components/AppLike'
import useDisplayedFolder from 'drive/hooks/useDisplayedFolder'
import { useSharingContext } from 'cozy-sharing'
import { ROOT_DIR_ID } from 'drive/constants/config'

jest.mock('drive/hooks/useDisplayedFolder')
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
      name: 'bill_201901.pdf'
    },
    {
      _id: 'bill_201902',
      dir_id: 'bills',
      name: 'bill_201902.pdf'
    },
    // shared file:
    {
      _id: 'bill_201903',
      dir_id: 'bills',
      name: 'bill_201903.pdf'
    }
  ]

  const setup = (entries = defaultEntries) => {
    const props = {
      entries,
      onClose: onCloseSpy,
      classes: { paper: {} }
    }

    useSharingContext.mockReturnValue({
      sharedPaths: ['/sharedFolder', '/bills/bill_201903.pdf'],
      refresh: refreshSpy
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
        }
      }
    })

    return render(
      <AppLike client={mockClient}>
        <MoveModal {...props} />
      </AppLike>
    )
  }

  describe('moveEntries', () => {
    it('should move entries to destination', async () => {
      useDisplayedFolder.mockReturnValue({ _id: 'destinationFolder' })

      CozyFile.getFullpath.mockImplementation((destinationFolder, name) =>
        Promise.resolve(
          name === 'bill_201903.pdf' ? '/bills/bill_201903.pdf' : '/whatever'
        )
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
          false
        )
        expect(onCloseSpy).toHaveBeenCalled()
        expect(refreshSpy).toHaveBeenCalled()
        // TODO: check that trashedFiles are passed to cancel button
      })
    })
  })

  /* describe('cancelMove', () => {
    it('should move items back to their previous location', async () => {
      const component = setupComponent()
      const callback = jest.fn()
      await component.instance().cancelMove(defaultEntries, [], callback)
      expect(CozyFile.move).toHaveBeenCalledWith('bill_201901', {
        folderId: 'bills'
      })
      expect(CozyFile.move).toHaveBeenCalledWith('bill_201902', {
        folderId: 'bills'
      })
      expect(restoreSpy).not.toHaveBeenCalled()
      expect(callback).toHaveBeenCalled()
    })

    it('should restore files that have been trashed due to conflicts', async () => {
      const callback = jest.fn()
      const component = setupComponent()
      await component
        .instance()
        .cancelMove([], ['trashed-1', 'trashed-2'], callback)
      expect(collectionSpy).toHaveBeenCalledWith('io.cozy.files')
      expect(restoreSpy).toHaveBeenCalledWith('trashed-1')
      expect(restoreSpy).toHaveBeenCalledWith('trashed-2')
      expect(callback).toHaveBeenCalled()
    })
  }) */
})
