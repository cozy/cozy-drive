import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { Router, hashHistory, Route, Redirect } from 'react-router'
import FileHistory from 'components/FileHistory'

import { setupStoreAndClient } from 'test/setup'
import AppLike from 'test/components/AppLike'

import { SharingsView } from './index'
import {
  generateFileFixtures,
  getByTextWithMarkup,
  removeNonASCII
} from '../testUtils'
import { useFilesQueryWithPath } from 'drive/web/modules/views/hooks'

jest.mock('components/pushClient')
jest.mock(
  'components/FileHistory',
  () =>
    function FileHistoryStub() {
      return <div>FileHistory stub</div>
    }
)
jest.mock('cozy-client/dist/hooks/useQuery', () =>
  jest.fn(() => ({
    fetchStatus: '',
    data: []
  }))
)
jest.mock('cozy-keys-lib', () => ({
  useVaultClient: jest.fn()
}))
jest.mock('drive/web/modules/views/hooks', () => ({
  ...jest.requireActual('drive/web/modules/views/hooks'),
  useFilesQueryWithPath: jest.fn()
}))
jest.mock('cozy-client/dist/utils', () => ({
  ...jest.requireActual('cozy-client/dist/utils'),
  hasQueryBeenLoaded: jest.fn().mockReturnValue(true)
}))
jest.mock('components/useHead', () => jest.fn())

const setup = (allLoaded = true) => {
  const { store, client } = setupStoreAndClient()

  client.plugins.realtime = {
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  }
  client.query = jest.fn().mockReturnValue([])
  client.stackClient.fetchJSON = jest
    .fn()
    .mockReturnValue({ data: [], rows: [] })

  const rendered = render(
    <AppLike client={client} store={store}>
      <Router history={hashHistory}>
        <Redirect from="/" to="/sharings" />
        <Route
          path="sharings"
          component={props => <SharingsView {...props} allLoaded={allLoaded} />}
        >
          <Route path="file/:fileId/revision" component={FileHistory} />
        </Route>
      </Router>
    </AppLike>
  )
  return { ...rendered, client }
}

describe('Sharings View', () => {
  const nbFiles = 2
  const path = '/test'
  const dir_id = 'dirIdParent'
  const updated_at = '2020-05-14T10:33:31.365224+02:00'

  const filesFixture = generateFileFixtures({
    nbFiles,
    path,
    dir_id,
    updated_at
  })

  const filesFixtureWithPath = {
    data: filesFixture.map(f => {
      return {
        ...f,
        displayedPath: path
      }
    })
  }

  it('should display placeholder when all files are not loaded', async () => {
    jest.spyOn(console, 'error').mockImplementation() // TODO: to be removed with https://github.com/cozy/cozy-libs/pull/1457

    const { container } = setup(false)

    await waitFor(() => {
      expect(
        container.querySelector('.fil-content-file-placeholder')
      ).not.toBeNull()
    })
  })

  it('should not display placeholder when all files are loaded', async () => {
    useFilesQueryWithPath.mockReturnValue(filesFixtureWithPath)

    const { container } = setup(true)

    await waitFor(() => {
      expect(
        container.querySelector('.fil-content-file-placeholder')
      ).toBeNull()
    })
  })

  it('tests the sharings view', async () => {
    useFilesQueryWithPath.mockReturnValue(filesFixtureWithPath)

    const { getByText, findByText } = setup()

    // // Display placeholder when all files are not loaded
    // expect(
    //   container.querySelector('.fil-content-file-placeholder')
    // ).not.toBeNull()

    // await act(async () => {
    //   await new Promise(resolve => setTimeout(resolve, 100))
    // })

    // // Do not display placeholder when all files are loaded
    // expect(container.querySelector('.fil-content-file-placeholder')).toBeNull()

    await waitFor(() => {
      // Get the HTMLElement containing the filename if exist. If not throw
      const el0 = getByText(`foobar0`)
      // Check if the filename is displayed with the extension. If not throw
      getByTextWithMarkup(getByText, `foobar0.pdf`)
      // get the FileRow element
      const fileRow0 = el0.closest('.fil-content-row')
      // check if the date is right
      expect(fileRow0.getElementsByTagName('time')[0].dateTime).toEqual(
        updated_at
      )
      // check the path to the parent's folder
      const linkElement0 = fileRow0.getElementsByClassName('fil-file-path')[0]
      expect(removeNonASCII(linkElement0.textContent)).toEqual(path)

      expect(linkElement0.href.endsWith(`#/folder/${dir_id}`)).toBe(true)

      // check if the ActionMenu is displayed
      fireEvent.click(fileRow0.getElementsByTagName('button')[0])
      const el1 = getByText(`foobar1`)
      const parentDiv1 = el1.closest('.fil-file')
      expect(
        removeNonASCII(
          parentDiv1.getElementsByClassName('fil-file-path')[0].textContent
        )
      ).toEqual(path)

      // navigates  to the history view
      const historyItem = getByText('History')
      fireEvent.click(historyItem)
    })

    await expect(findByText('FileHistory stub')).resolves.toBeTruthy()
  })
})
