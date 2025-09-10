import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { DeleteConfirm } from './DeleteConfirm'
import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'

import { trashFiles } from '@/modules/actions/utils'

const setSelectedItems = jest.fn()

jest.mock('modules/selection/SelectionProvider', () => ({
  ...jest.requireActual('modules/selection/SelectionProvider'),
  useSelectionContext: () => ({
    setSelectedItems
  })
}))

jest.mock('modules/actions/utils', () => ({
  trashFiles: jest.fn().mockResolvedValue({})
}))

describe('DeleteConfirm', () => {
  const setup = files => {
    const client = createMockClient({})
    const afterConfirmation = jest.fn()
    const onClose = jest.fn()

    const renderResult = render(
      <AppLike client={client}>
        <DeleteConfirm
          files={files}
          afterConfirmation={afterConfirmation}
          onClose={onClose}
        />
      </AppLike>
    )

    return { client, afterConfirmation, onClose, ...renderResult }
  }

  it('tests the component', async () => {
    const files = [generateFile({ i: '10', type: 'file' })]
    const { client, afterConfirmation, onClose, getByText } = setup(files)

    expect(getByText('Delete foobar10?')).toBeTruthy()

    const confirmButton = getByText('Remove')
    fireEvent.click(confirmButton)

    expect(trashFiles).toHaveBeenCalledWith(
      client,
      files,
      expect.objectContaining({})
    )

    waitFor(() => {
      expect(afterConfirmation).toHaveBeenCalled()
      expect(setSelectedItems).toHaveLength(0)
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('removes only the deletes file from selection', async () => {
    const files = Array.from({ length: 10 }, (_, i) =>
      generateFile({ i: i + 1, type: 'file' })
    )
    const selectedItems = {
      [files[0].id]: files[0],
      [files[1].id]: files[1],
      [files[2].id]: files[2]
    }
    const fileToDelete = [files[4]]
    const { client, afterConfirmation, onClose, getByText } =
      setup(fileToDelete)

    expect(getByText('Delete foobar5?')).toBeTruthy()
    fireEvent.click(getByText('Remove'))

    expect(trashFiles).toHaveBeenCalledWith(
      client,
      fileToDelete,
      expect.objectContaining({})
    )

    waitFor(() => {
      expect(afterConfirmation).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
      expect(setSelectedItems).toHaveBeenCalledWith(expect.any(Function))

      const updateFn = setSelectedItems.mock.calls[0][0]
      const result = updateFn(selectedItems)

      expect(result).toEqual(selectedItems)
    })
  })
})
