import { render, screen } from '@testing-library/react'
import React from 'react'

import { FolderPickerBody } from 'components/FolderPicker/FolderPickerBody'

jest.mock('components/FolderPicker/FolderPickerContentCozy', () => ({
  FolderPickerContentCozy: () => <div>FolderPickerContentCozy</div>
}))
jest.mock('components/FolderPicker/FolderPickerContentNextcloud', () => ({
  FolderPickerContentNextcloud: () => <div>FolderPickerContentNextcloud</div>
}))
jest.mock('components/FolderPicker/FolderPickerContentRoot', () => ({
  FolderPickerContentRoot: () => <div>FolderPickerContentRoot</div>
}))

describe('FolderPickerBody', () => {
  it('should display root when folder undefined', () => {
    render(<FolderPickerBody />)
    expect(screen.getByText('FolderPickerContentRoot')).toBeInTheDocument()
  })

  it('return cozy folder', () => {
    const cozyFolder = {
      _type: 'io.cozy.files'
    }
    render(<FolderPickerBody folder={cozyFolder} />)
    expect(screen.getByText('FolderPickerContentCozy')).toBeInTheDocument()
  })

  it('return Nextcloud folder', () => {
    const nextcloudFolder = {
      _type: 'io.cozy.remote.nextcloud.files'
    }
    render(<FolderPickerBody folder={nextcloudFolder} />)
    expect(screen.getByText('FolderPickerContentNextcloud')).toBeInTheDocument()
  })
})
