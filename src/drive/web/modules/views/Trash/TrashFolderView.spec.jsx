import React from 'react'
import { useQuery } from 'cozy-client'
import { render, act } from '@testing-library/react'
import { Router, hashHistory, Route, Redirect } from 'react-router'

import { setupStoreAndClient } from 'test/setup'
import AppLike from 'test/components/AppLike'

import { generateFileFixtures } from '../testUtils'
import TrashFolderView from './TrashFolderView'

import FolderViewBody from '../Folder/FolderViewBody'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('components/pushClient')

describe('TrashFolderView', () => {
  const mockClient = () => {
    const { store, client } = setupStoreAndClient({
      initialStoreState: {
        router: { location: { pathname: '/trash' } }
      }
    })

    client.plugins.realtime = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    }
    client.query = jest.fn().mockReturnValue([])
    client.stackClient.fetchJSON = jest
      .fn()
      .mockReturnValue({ data: [], rows: [] })
    return { store, client }
  }
  const setup = () => {
    const { store, client } = mockClient()

    const rendered = render(
      <AppLike client={client} store={store}>
        <Router history={hashHistory}>
          <Redirect from="/" to="/trash" />
          <Route path="/trash" component={TrashFolderView} />
          <Route path="/folder/:id" component={TrashFolderView} />
        </Router>
      </AppLike>
    )
    return { ...rendered, client }
  }

  it('renders the Trash view', async () => {
    const nbFiles = 1
    const path = '/trash'
    const dir_id = 'io.cozy.files.trash-dir'
    const updated_at = '2020-05-14T10:33:31.365224+02:00'
    const filesFixture = generateFileFixtures({
      nbFiles,
      path,
      dir_id,
      updated_at
    })
    const foldersFixture = generateFileFixtures({
      nbFiles,
      path,
      dir_id,
      updated_at,
      type: 'directory',
      prefix: 'folder'
    })
    const { store, client } = mockClient()
    const { getByText } = render(
      <AppLike client={client} store={store}>
        <FolderViewBody
          currentFolderId={'io.cozy.trash'}
          queryResults={[
            {
              data: filesFixture,
              count: filesFixture.length
            },
            {
              data: foldersFixture,
              count: foldersFixture.length
            }
          ]}
          actions={[]}
        />
      </AppLike>
    )
    const sleep = duration =>
      new Promise(resolve => setTimeout(resolve, duration))
    await act(async () => {
      await sleep(100)
    })
    // Check if we display the folder and the file
    getByText(`folder0`)
    getByText(`foobar0`)
  })

  it('renders the empty trash view', async () => {
    useQuery.mockReturnValue({
      data: [],
      count: 0
    })

    const { getByText } = setup()
    const sleep = duration =>
      new Promise(resolve => setTimeout(resolve, duration))
    await act(async () => {
      await sleep(100)
    })
    getByText(`You don’t have any deleted files.`)
  })
})
