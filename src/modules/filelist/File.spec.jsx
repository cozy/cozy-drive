'use strict'

import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { useSharingContext } from 'cozy-sharing'
import { createMockClient } from 'cozy-client'

import AppLike from 'test/components/AppLike'
import { DumbFile } from './File'
import { folder, actionsMenu } from 'test/data'

jest.mock('cozy-sharing', () => ({
  ...jest.requireActual('cozy-sharing'),
  useSharingContext: jest.fn()
}))

useSharingContext.mockReturnValue({ byDocId: [] })

const client = createMockClient({})

const setup = ({
  attributes = folder,
  actions = actionsMenu,
  selected = false,
  withSelectionCheckbox = true,
  selectionModeActive = false,
  onFolderOpen = jest.fn(),
  onFileOpen = jest.fn(),
  onCheckboxToggle = jest.fn(),
  isInSyncFromSharing = false,
  disableSelection = false
} = {}) => {
  const root = render(
    <AppLike client={client}>
      <DumbFile
        attributes={attributes}
        actions={actions}
        selected={selected}
        withSelectionCheckbox={withSelectionCheckbox}
        selectionModeActive={selectionModeActive}
        onFolderOpen={onFolderOpen}
        onFileOpen={onFileOpen}
        onCheckboxToggle={onCheckboxToggle}
        isInSyncFromSharing={isInSyncFromSharing}
        disableSelection={disableSelection}
      />
    </AppLike>
  )
  return { root }
}

describe('File', () => {
  describe('default behavior', () => {
    it('should show a select box', () => {
      const { root } = setup()
      const { getByRole } = root

      expect(getByRole('checkbox'))
    })

    it('should not show spinner', () => {
      const { root } = setup()
      const { queryByTestId } = root

      expect(queryByTestId('fil-file-thumbnail--spinner')).toBeNull()
    })

    it('should show actions menu when clicking the actionsMenu button', async () => {
      // TODO : Fix https://github.com/cozy/cozy-drive/issues/2913
      jest.spyOn(console, 'warn').mockImplementation()
      const { root } = setup()
      const { getByRole, findByText } = root

      fireEvent.click(getByRole('button', { description: 'More' }))
      expect(await findByText('ActionsMenuItem'))
    })
  })

  describe('In sync from sharing behavior', () => {
    it('should show spinner', () => {
      const { root } = setup({ isInSyncFromSharing: true })
      const { getByTestId } = root

      expect(getByTestId('fil-file-thumbnail--spinner'))
    })

    it('should not show actions menu when clicking the actionsMenu button', () => {
      const { root } = setup({ isInSyncFromSharing: true })
      const { getByRole, queryByText } = root

      fireEvent.click(getByRole('button', { description: 'More' }))
      expect(queryByText('ActionsMenuItem')).toBeNull()
    })

    it('should not show a select box when syncing', () => {
      const { root } = setup({ isInSyncFromSharing: true })
      const { queryByRole } = root

      expect(queryByRole('checkbox')).toBeNull()
    })

    it('should not show a select box when selection disabled', () => {
      const { root } = setup({ disableSelection: true })
      const { queryByRole } = root

      expect(queryByRole('checkbox')).toBeNull()
    })

    it('should not have clickable sharing avatars', () => {
      const { root } = setup({ isInSyncFromSharing: true })
      const { getByTestId } = root

      expect(getByTestId('fil-content-sharestatus--noAvatar'))
    })
  })
})
