import React from 'react'
import { mount } from 'enzyme'
import { setupFolderContent, mockCozyClientRequestQuery } from 'test/setup'
import Dropzone, { Dropzone as DumbDropzone } from './Dropzone'
import AppLike from 'test/components/AppLike'
import { render } from '@testing-library/react'

jest.mock('react-dropzone', () => {
  const Component = ({
    onDrop,
    disabled,
    role,
    className,
    disableClick,
    style,
    onDropEnter, // eslint-disable-line no-unused-vars
    onDropLeave, // eslint-disable-line no-unused-vars
    ...rest
  }) => (
    <button
      {...rest}
      disabled={disabled}
      role={role}
      className={className}
      data-disable-click={disableClick}
      style={style}
      data-test-id="drop-button"
      onClick={() => onDrop(['files'], '_', { dataTransfer: { items: [] } })}
    />
  )
  Component.displayName = 'drop-component'
  return Component
})
jest.mock('drive/web/modules/navigation/duck', () => ({
  uploadFiles: jest.fn().mockReturnValue({
    type: 'FAKE_UPLOAD_FILES'
  })
}))

mockCozyClientRequestQuery()

describe('Dropzone', () => {
  it('should match snapshot', async () => {
    // Given
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const displayedFolder = {
      id: 'directory-foobar0'
    }
    const { store, client } = await setupFolderContent({
      folderId: 'directory-foobar0'
    })

    store.dispatch = jest.fn()

    // When
    const root = mount(
      <AppLike client={client} store={store}>
        <Dropzone displayedFolder={displayedFolder} />
      </AppLike>
    )

    // Then
    expect(root).toMatchSnapshot()

    // After
    consoleSpy.mockRestore()
  })

  it('should dispatch the uploadFiles action', () => {
    // Given
    const uploadFilesMock = jest.fn()
    const cozyClient = 'cozyClient'
    const vaultClient = 'vaultClient'
    const { getByTestId } = render(
      <DumbDropzone
        uploadFiles={uploadFilesMock}
        client={cozyClient}
        vaultClient={vaultClient}
      />
    )

    // When
    getByTestId('drop-button').click()

    // Then
    expect(uploadFilesMock).toHaveBeenCalledWith(['files'], {
      client: cozyClient,
      vaultClient
    })
  })
})
