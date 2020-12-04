'use strict'

jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))

import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { createMockClient } from 'cozy-client'

import AppLike from 'test/components/AppLike'
import { DumbFile } from './File'
import { folder, actionsMenu } from 'test/data'

const client = createMockClient({})

const setup = ({
  attributes = folder,
  actions = actionsMenu,
  selected = false,
  withSelectionCheckbox = true,
  isAvailableOffline = false,
  selectionModeActive = false,
  onFolderOpen = jest.fn(),
  onFileOpen = jest.fn(),
  onCheckboxToggle = jest.fn(),
  isInSyncFromSharing = false
} = {}) => {
  const root = render(
    <AppLike client={client}>
      <DumbFile
        attributes={attributes}
        actions={actions}
        selected={selected}
        withSelectionCheckbox={withSelectionCheckbox}
        isAvailableOffline={isAvailableOffline}
        selectionModeActive={selectionModeActive}
        onFolderOpen={onFolderOpen}
        onFileOpen={onFileOpen}
        onCheckboxToggle={onCheckboxToggle}
        isInSyncFromSharing={isInSyncFromSharing}
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
      const { root } = setup()
      const { getByRole, findByText } = root

      fireEvent.click(getByRole('button', { name: 'More' }))
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

      fireEvent.click(getByRole('button', { name: 'More' }))
      expect(queryByText('ActionsMenuItem')).toBeNull()
    })

    it('should not show a select box', () => {
      const { root } = setup({ isInSyncFromSharing: true })
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
