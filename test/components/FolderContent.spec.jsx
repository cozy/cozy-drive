import { setupFolderContent } from 'test/setup'

describe('FolderContent', () => {
  /**
   * It is important to check that the state is correctly filled since
   * other components will rely on the store's content
   */
  it('should fill the state', async () => {
    const { root, client } = await setupFolderContent()

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
