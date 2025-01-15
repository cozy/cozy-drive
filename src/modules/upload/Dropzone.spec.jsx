import { render } from '@testing-library/react'
import React from 'react'

import { Dropzone as DumbDropzone } from './Dropzone'
import { mockCozyClientRequestQuery } from 'test/setup'

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
      data-testid="drop-button"
      onClick={() => onDrop(['files'], '_', { dataTransfer: { items: [] } })}
    />
  )
  Component.displayName = 'drop-component'
  return Component
})
jest.mock('modules/navigation/duck', () => ({
  uploadFiles: jest.fn().mockReturnValue({
    type: 'FAKE_UPLOAD_FILES'
  })
}))
jest.mock('cozy-keys-lib', () => ({
  withVaultClient: jest.fn().mockImplementation(arg => arg),
  useVaultClient: jest.fn()
}))

mockCozyClientRequestQuery()

describe('Dropzone', () => {
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
