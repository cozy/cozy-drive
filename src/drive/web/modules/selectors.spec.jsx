import React, { useMemo } from 'react'
import { mount } from 'enzyme'
import configureStore from '../../store/configureStore'
import CozyClient, { useQuery } from 'cozy-client'
import { buildQuery } from 'drive/web/modules/queries'
import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'
import { getFolderContent } from './selectors'

jest.mock('cozy-sharing', () => ({}))
jest.mock('drive/web/modules/navigation/AppRoute', () => ({ routes: [] }))

/** A simple component firing the same query as DriveView */
const Component = ({ folderId, sortOrder }) => {
  const folderQuery = useMemo(
    () =>
      buildQuery({
        currentFolderId: folderId,
        type: 'directory',
        sortAttribute: sortOrder.attribute,
        sortOrder: sortOrder.order
      }),
    [folderId, sortOrder]
  )
  const { data: folders } = useQuery(
    folderQuery.definition,
    folderQuery.options
  )
  return <div>{folders && folders.length}</div>
}

const setup = async () => {
  const client = new CozyClient({})

  const store = configureStore({
    client,
    t: x => x
  })
  const folderId = 'folderid123456'
  const sortOrder = {
    attribute: 'name',
    order: 'desc'
  }
  const root = mount(
    <AppLike store={store} client={client}>
      <Component folderId={folderId} sortOrder={sortOrder} />
    </AppLike>
  )

  await sleep(1)
  root.update()

  return { root, store, client }
}

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

beforeEach(() => {
  const files = Array(10)
    .fill(null)
    .map((x, i) => generateFile({ i }))

  jest.spyOn(CozyClient.prototype, 'requestQuery').mockResolvedValue({
    data: files.map(x => ({
      ...x,
      _type: 'io.cozy.files'
    }))
  })
})

afterEach(() => {
  CozyClient.prototype.requestQuery.mockRestore()
})

describe('Component', () => {
  it('should fill the state', async () => {
    const { root, client } = await setup()

    expect(client.requestQuery).toHaveBeenCalled()
    expect(root.text()).toBe('10')

    const state = client.store.getState()
    expect(state.cozy.queries).toEqual(
      expect.objectContaining({
        'directory folderid123456 name desc': expect.objectContaining({
          data: expect.any(Array)
        })
      })
    )
  })
})

describe('getFolderContent', () => {
  it('should return content from cozy client queries', async () => {
    const { store } = await setup()
    const state = store.getState()
    const files = getFolderContent(state, 'folderid123456')
    expect(files.length).toBe(10)
  })
})
