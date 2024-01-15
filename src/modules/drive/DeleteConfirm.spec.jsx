import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { DeleteConfirm } from './DeleteConfirm'
import { trashFiles } from 'modules/actions/utils'
import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'

jest.mock('modules/actions/utils', () => ({
  trashFiles: jest.fn().mockResolvedValue({})
}))

describe('DeleteConfirm', () => {
  it('tests the component', async () => {
    const client = createMockClient({})
    const files = [generateFile({ i: '10', type: 'file' })]
    const onClose = jest.fn()
    const afterConfirmation = jest.fn()
    const { getByText } = render(
      <AppLike client={client}>
        <DeleteConfirm
          files={files}
          afterConfirmation={afterConfirmation}
          onClose={onClose}
        />
      </AppLike>
    )

    expect(getByText('Delete foobar10?')).toBeTruthy()

    const confirmButton = getByText('Remove')
    fireEvent.click(confirmButton)

    expect(trashFiles).toHaveBeenCalledWith(client, files)

    waitFor(() => {
      expect(afterConfirmation).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })
})
