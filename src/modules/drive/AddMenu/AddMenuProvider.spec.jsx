import { fireEvent, render } from '@testing-library/react'
import React, { useContext } from 'react'

import { createMockClient } from 'cozy-client'

import AddMenuProvider, { AddMenuContext } from './AddMenuProvider'
import logger from 'lib/logger'
import AppLike from 'test/components/AppLike'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}))
jest.mock('lib/logger', () => ({
  error: jest.fn()
}))

const client = createMockClient({})

describe('AddMenuContext', () => {
  it('should log exception on click offline on add button', () => {
    // Given
    const Component = () => {
      const { handleOfflineClick } = useContext(AddMenuContext)
      return <button data-testid="button" onClick={handleOfflineClick} />
    }
    const { container, getByTestId } = render(
      <AppLike client={client}>
        <AddMenuProvider>
          <Component />
        </AddMenuProvider>
      </AppLike>
    )
    // When
    fireEvent.click(getByTestId('button'))
    fireEvent.click(container)

    // Then
    expect(logger.error).toHaveBeenCalledWith(
      'Offline click on AddMenu button detected. Here is the value of window.navigator.onLine: true'
    )
  })
})
