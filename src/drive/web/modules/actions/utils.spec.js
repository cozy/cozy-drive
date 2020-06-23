import CozyClient from 'cozy-client'
import { initQuery, receiveQueryResult } from 'cozy-client/dist/store'
import configureStore from 'drive/store/configureStore'
import { generateFile } from 'test/generate'
import { trashFiles } from './utils'
import FileCollection from 'cozy-stack-client/dist/FileCollection'
import { TRASH_DIR_ID } from 'drive/constants/config'

jest.mock('drive/web/modules/navigation/AppRoute', () => ({
  routes: []
}))

jest.mock('cozy-stack-client/dist/FileCollection', () => {
  class FileCollection {}
  FileCollection.prototype.destroy = jest.fn()
  return FileCollection
})

describe('trashFiles', () => {
  const setup = () => {
    const client = new CozyClient()
    const store = configureStore({
      client
    })
    store.dispatch(
      initQuery('files', {
        doctype: 'io.cozy.files'
      })
    )

    const file = generateFile({ i: 0 })
    store.dispatch(
      receiveQueryResult('files', {
        data: file
      })
    )
    return { client, store, file }
  }
  it('should destroy the file and update queries', async () => {
    const { store, client, file } = setup()
    FileCollection.prototype.destroy.mockImplementation(async file => ({
      data: {
        ...file,
        dir_id: TRASH_DIR_ID
      }
    }))

    const state = store.getState()

    // Make sure that the state is OK
    expect(state.cozy.documents['io.cozy.files'][file._id]._id).toEqual(
      file._id
    )

    await trashFiles(client, [file])
    expect(FileCollection.prototype.destroy).toHaveBeenCalledWith(file)

    const state2 = store.getState()
    const updatedFile = state2.cozy.documents['io.cozy.files'][file._id]
    expect(updatedFile.dir_id).toEqual('io.cozy.files.trash-dir')
  })
})
