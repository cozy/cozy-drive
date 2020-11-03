import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { Router, hashHistory, Route, Redirect } from 'react-router'

import { setupStoreAndClient } from 'test/setup'
import AppLike from 'test/components/AppLike'
import usePublicFilesQuery from './usePublicFilesQuery'
import FileHistory from 'components/FileHistory'

import { generateFileFixtures, getByTextWithMarkup } from '../testUtils'

import PublicFolderView from './index'

jest.mock('./usePublicFilesQuery', () => {
  return jest.fn()
})
jest.mock(
  'components/FileHistory',
  () =>
    function FileHistoryStub() {
      return <div>FileHistory stub</div>
    }
)
jest.mock('components/pushClient')

describe('Public View', () => {
  const setup = () => {
    const { store, client } = setupStoreAndClient()

    client.plugins.realtime = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    }
    client.query = jest.fn().mockReturnValue([])

    const rendered = render(
      <AppLike client={client} store={store}>
        <Router history={hashHistory}>
          <Redirect from="/" to="/folder/123" />
          <Route path="folder(/:folderId)" component={PublicFolderView}>
            <Route path="file/:fileId/revision" component={FileHistory} />
          </Route>
        </Router>
      </AppLike>
    )
    return { ...rendered, client }
  }

  it('renders the public view', async () => {
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

    usePublicFilesQuery.mockReturnValue({
      data: filesFixture,
      fetchStatus: 'loaded',
      refreshFolderContent: jest.fn()
    })

    const { getByText, findByText } = setup()
    const sleep = duration =>
      new Promise(resolve => setTimeout(resolve, duration))
    await act(async () => {
      await sleep(100)
    })

    // Get the HTMLElement containing the filename if exist. If not throw
    const el0 = getByText(`foobar0`)
    // Check if the filename is displayed with the extension. If not throw
    getByTextWithMarkup(getByText, `foobar0.pdf`)
    //get the FileRow element
    const fileRow0 = el0.closest('.fil-content-row')
    //check if the date is right
    expect(fileRow0.getElementsByTagName('time')[0].dateTime).toEqual(
      updated_at
    )

    //check if the ActionMenu is displayed
    fireEvent.click(fileRow0.getElementsByTagName('button')[0])
    // navigates  to the history view
    const historyItem = getByText('History')
    fireEvent.click(historyItem)

    await expect(findByText('FileHistory stub')).resolves.toBeTruthy()
  })
})
