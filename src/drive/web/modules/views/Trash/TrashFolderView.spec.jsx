import React from 'react'
import { useQuery } from 'cozy-client'
import { render } from '@testing-library/react'
import { Router, hashHistory, Route } from 'react-router'

import { setupStoreAndClient } from 'test/setup'
import { generateFile } from 'test/generate'
import AppLike from 'test/components/AppLike'

import TrashFolderView from './TrashFolderView'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

describe('TrashFolderView', () => {
  const setup = ({
    nbFiles = 5,
    totalCount,
    path = '/test',
    dir_id = 'io.cozy.files.trash-dir',
    updated_at = '2020-05-14T10:33:31.365224+02:00'
  } = {}) => {
    const { store, client } = setupStoreAndClient()

    client.plugins.realtime = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    }
    client.query = jest.fn().mockReturnValue([])
    client.stackClient.fetchJSON = jest
      .fn()
      .mockReturnValue({ data: [], rows: [] })
    const filesFixture = Array(nbFiles)
      .fill(null)
      .map((x, i) =>
        generateFile({ i, type: 'file', path, dir_id, updated_at })
      )
    const foldersFixture = Array(nbFiles)
      .fill(null)
      .map((x, i) =>
        generateFile({
          i,
          type: 'directory',
          path,
          dir_id,
          updated_at,
          prefix: 'folder'
        })
      )
    useQuery
      .mockReturnValueOnce({
        data: filesFixture,
        count: totalCount || filesFixture.length
      })
      .mockReturnValueOnce({
        data: foldersFixture,
        count: totalCount || foldersFixture.length
      })
      .mockReturnValue({
        data: [],
        count: 0
      })

    const rendered = render(
      <AppLike client={client} store={store}>
        <Router history={hashHistory}>
          <Route path="/" component={TrashFolderView} />
          <Route path="/folder/:id" component={TrashFolderView} />
          <Route path="/folder/file/:id" component={() => null} />
        </Router>
      </AppLike>
    )
    return { ...rendered, client }
  }

  it('test the Trash view', () => {
    const nbFiles = 1
    const path = '/trash'
    const dir_id = 'io.cozy.files.trash-dir'
    const updated_at = '2020-05-14T10:33:31.365224+02:00'
    const { getByText } = setup({
      nbFiles,
      path,
      dir_id,
      updated_at
    })

    // Check if we display the folder and the file
    getByText(`folder0`)
    getByText(`foobar0`)
  })
})
