import React, { useContext } from 'react'
import { fireEvent, render } from '@testing-library/react'
import AddMenuProvider, { AddMenuContext } from './AddMenuProvider'
import { logException } from 'drive/lib/reporter'
import AppLike from 'test/components/AppLike'
import { createMockClient } from 'cozy-client'

jest.mock(
  'drive/web/modules/drive/Toolbar/components/ScanWrapper',
  // eslint-disable-next-line react/display-name
  () => () => <div />
)
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}))
jest.mock('drive/lib/reporter', () => ({
  logException: jest.fn()
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
    expect(logException).toHaveBeenCalledWith(
      'Offline click on AddMenu button detected. Here is the value of window.navigator.onLine: true'
    )
  })
})
