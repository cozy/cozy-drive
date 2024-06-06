import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { FolderPickerTopbar } from 'components/FolderPicker/FolderPickerTopbar'
import AppLike from 'test/components/AppLike'

describe('FolderPickerTopbar', () => {
  const navigateTo = jest.fn()
  const showFolderCreation = jest.fn()

  const cozyFolder = {
    _id: '123',
    _type: 'io.cozy.files',
    dir_id: 'io.cozy.files.root-dir',
    name: 'Photos'
  }

  const rootCozyFolder = {
    _id: 'io.cozy.files.root-dir',
    _type: 'io.cozy.files'
  }

  const nextcloudFolder = {
    _id: '123',
    _type: 'io.cozy.remote.nextcloud.files',
    path: '/Documents',
    name: 'Documents',
    cozyMetadata: {
      sourceAccount: '123'
    }
  }

  const rootNextcloudFolder = {
    _id: '123',
    _type: 'io.cozy.remote.nextcloud.files',
    path: '/',
    name: 'Cozycloud (Nextcloud)',
    cozyMetadata: {
      sourceAccount: '123'
    }
  }

  const setup = ({
    canCreateFolder = false,
    folder,
    showNextcloudFolder
  } = {}) => {
    const mockClient = createMockClient({
      queries: {
        'onlyfolder-io.cozy.files.root-dir': {
          doctype: 'io.cozy.files',
          definition: {
            doctype: 'io.cozy.files',
            id: 'io.cozy.files.root-dir'
          },
          data: [
            {
              id: 'io.cozy.files.root-dir',
              _type: 'io.cozy.files',
              type: 'directory'
            }
          ]
        }
      }
    })

    return render(
      <AppLike client={mockClient}>
        <FolderPickerTopbar
          navigateTo={navigateTo}
          folder={folder}
          canCreateFolder={canCreateFolder}
          showNextcloudFolder={showNextcloudFolder}
        />
      </AppLike>
    )
  }

  /**
   * Cas à vérifier
   * Nom afficher
   * Affichage de la création de dossier
   * Affichage du bouton de retour
   * Tout les temps affiche sauf dans deux cas, si le dossier est undefined ou si le dossier est le dossier racine et showNextcloudFolder est faux
   *
   *
   */

  it('should hide back button on root', () => {
    setup({ showNextcloudFolder: true })

    expect(screen.getByText('Drives')).toBeInTheDocument()

    const backButton = screen.queryByRole('button', {
      name: 'Back'
    })
    expect(backButton).toBeNull()
  })

  it('should show back button for a cozy folder', () => {
    setup({ folder: cozyFolder })

    expect(screen.getByText('Photos')).toBeInTheDocument()

    const backButton = screen.getByRole('button', {
      name: 'Back'
    })
    fireEvent.click(backButton)
    waitFor(() => {
      expect(navigateTo).toHaveBeenCalledWith(rootCozyFolder)
    })
  })

  it('should hide back button for the root cozy folder', () => {
    setup({ folder: rootCozyFolder })

    expect(screen.getByText('Drive')).toBeInTheDocument()

    const backButton = screen.queryByRole('button', {
      name: 'Back'
    })
    expect(backButton).toBeNull()
  })

  it('should show back button for the root cozy folder when Nextcloud is displayed', () => {
    setup({ folder: rootCozyFolder, showNextcloudFolder: true })

    expect(screen.getByText('Drive')).toBeInTheDocument()

    const backButton = screen.getByRole('button', {
      name: 'Back'
    })
    fireEvent.click(backButton)
    waitFor(() => {
      expect(navigateTo).toHaveBeenCalledWith(undefined)
    })
  })

  it('should show back button for a nextcloud folder', () => {
    setup({ folder: nextcloudFolder, showNextcloudFolder: true })

    expect(screen.getByText('Documents')).toBeInTheDocument()

    const backButton = screen.getByRole('button', {
      name: 'Back'
    })
    fireEvent.click(backButton)
    waitFor(() => {
      expect(navigateTo).toHaveBeenCalledWith(rootNextcloudFolder)
    })
  })

  it('should show back button for a root nextcloud folder', () => {
    setup({ folder: rootNextcloudFolder, showNextcloudFolder: true })

    expect(screen.getByText('Cozycloud (Nextcloud)')).toBeInTheDocument()

    const backButton = screen.getByRole('button', {
      name: 'Back'
    })
    fireEvent.click(backButton)
    waitFor(() => {
      expect(navigateTo).toHaveBeenCalledWith()
    })
  })

  it('should show create folder button when canCreateFolder and inside cozy folder', () => {
    setup({ canCreateFolder: true, folder: cozyFolder })

    const addFolderButton = screen.getByRole('button', {
      name: 'Add a folder'
    })
    fireEvent.click(addFolderButton)
    waitFor(() => {
      expect(showFolderCreation).toBeCalled()
    })
  })

  it('should hide create folder button when canCreateFolder is false', () => {
    setup({ canCreateFolder: false, folder: cozyFolder })

    const addFolderButton = screen.queryByRole('button', {
      name: 'Add a folder'
    })
    expect(addFolderButton).toBeNull()
  })

  it('should hide create folder button when canCreateFolder is true but its inside root folder', () => {
    setup({ canCreateFolder: true })

    const addFolderButton = screen.queryByRole('button', {
      name: 'Add a folder'
    })
    expect(addFolderButton).toBeNull()
  })

  it('should hide create folder button when canCreateFolder is true but its inside Nextcloud folder', () => {
    setup({
      canCreateFolder: true,
      folder: nextcloudFolder,
      showNextcloudFolder: true
    })

    const addFolderButton = screen.queryByRole('button', {
      name: 'Add a folder'
    })
    expect(addFolderButton).toBeNull()
  })
})
