import MockDate from 'mockdate'

import CozyClient from 'cozy-client'

import { isTrashedDocument, isWithinPickerRoot } from './documents'

import { ROOT_DIR_ID, TRASH_DIR_ID, TRASH_DIR_PATH } from '@/constants/config'

describe('isWithinPickerRoot', () => {
  beforeEach(() => MockDate.set('2026-01-01T00:00:00Z'))
  afterEach(() => MockDate.reset())

  const root = {
    _id: 'projects',
    _type: 'io.cozy.files',
    type: 'directory',
    path: '/Projects'
  }
  const parent = {
    ...root,
    _id: 'parent',
    dir_id: 'unloaded-ancestor',
    path: '/Projects/Year/Month/Day'
  }
  const file = {
    _id: 'file',
    _type: 'io.cozy.files',
    type: 'file',
    dir_id: 'parent'
  }

  function setup() {
    const documents = new Map([
      [root._id, root],
      [parent._id, parent]
    ])
    const requests = []
    const client = new CozyClient({
      links: [
        {
          request: async query => {
            requests.push(query.id)
            const document = documents.get(query.id)
            if (!document) throw new Error('Document not found')
            return { data: { ...document } }
          },
          persistCozyData: async () => {}
        }
      ]
    })
    return { client, documents, requests }
  }

  it.each([
    ['/Projects', true],
    ['/Projects/Child', true],
    ['/Projects-old', false],
    ['/Projects-old/Child', false],
    ['/Elsewhere/Projects', false]
  ])(
    'checks directory path %s against the exact subtree boundary',
    async (path, allowed) => {
      const { client, requests } = setup()

      await expect(
        isWithinPickerRoot(client, { ...parent, path }, root._id)
      ).resolves.toBe(allowed)
      expect(requests).toEqual(['projects'])
    }
  )

  it('checks a deeply nested file with only the root and parent reads', async () => {
    const { client, requests } = setup()

    await expect(isWithinPickerRoot(client, file, root._id)).resolves.toBe(true)
    expect(requests).toEqual(['projects', 'parent'])
  })

  it('reuses the fresh root for a file directly inside it', async () => {
    const { client, requests } = setup()

    await expect(
      isWithinPickerRoot(client, { ...file, dir_id: root._id }, root._id)
    ).resolves.toBe(true)
    expect(requests).toEqual(['projects'])
  })

  it('accepts the root itself and descendants when its path is /', async () => {
    const { client, documents } = setup()
    documents.set(root._id, { ...root, path: '/' })

    await expect(
      isWithinPickerRoot(client, { ...root, path: '/' }, root._id)
    ).resolves.toBe(true)
    await expect(isWithinPickerRoot(client, parent, root._id)).resolves.toBe(
      true
    )
  })

  it('refreshes a moved or renamed root instead of trusting its cached path', async () => {
    const { client, documents } = setup()
    await expect(isWithinPickerRoot(client, parent, root._id)).resolves.toBe(
      true
    )
    documents.set(root._id, { ...root, path: '/Archive/Renamed' })
    MockDate.set(Date.now() + 1)

    await expect(isWithinPickerRoot(client, parent, root._id)).resolves.toBe(
      false
    )
    await expect(
      isWithinPickerRoot(
        client,
        { ...parent, path: '/Archive/Renamed/Child' },
        root._id
      )
    ).resolves.toBe(true)
  })

  it('refreshes a file parent that moved outside the subtree', async () => {
    const { client, documents } = setup()
    await expect(isWithinPickerRoot(client, file, root._id)).resolves.toBe(true)
    documents.set(parent._id, { ...parent, path: '/Elsewhere' })
    MockDate.set(Date.now() + 1)

    await expect(isWithinPickerRoot(client, file, root._id)).resolves.toBe(
      false
    )
  })

  it.each([
    { path: null },
    { path: 'relative/path' },
    { path: `${TRASH_DIR_PATH}/Projects` },
    { driveId: 'remote-drive' },
    { type: 'file' }
  ])('refuses an unverifiable restricted root: %j', async change => {
    const { client, documents } = setup()
    documents.set(root._id, { ...root, ...change })

    await expect(isWithinPickerRoot(client, parent, root._id)).resolves.toBe(
      false
    )
  })

  it.each([
    { path: null },
    { path: 'relative/path' },
    { path: `${TRASH_DIR_PATH}/Parent` },
    { driveId: 'remote-drive' },
    { type: 'file' }
  ])('refuses an unverifiable file parent: %j', async change => {
    const { client, documents } = setup()
    documents.set(parent._id, { ...parent, ...change })

    await expect(isWithinPickerRoot(client, file, root._id)).resolves.toBe(
      false
    )
  })

  it.each([
    null,
    { ...parent, driveId: 'remote-drive' },
    { ...parent, path: `${TRASH_DIR_PATH}/Parent` },
    { ...file, dir_id: null }
  ])('rejects invalid items before fetching: %j', async item => {
    const { client, requests } = setup()

    await expect(isWithinPickerRoot(client, item, root._id)).resolves.toBe(
      false
    )
    expect(requests).toEqual([])
  })

  it.each(['projects', 'parent'])(
    'does not authorize selection when %s cannot be fetched',
    async missingId => {
      const { client, documents } = setup()
      documents.delete(missingId)

      await expect(isWithinPickerRoot(client, file, root._id)).rejects.toThrow(
        'Document not found'
      )
    }
  )
})

describe('isTrashedDocument', () => {
  it('returns false for null or undefined input', () => {
    expect(isTrashedDocument(null)).toBe(false)
    expect(isTrashedDocument(undefined)).toBe(false)
  })

  it('identifies the trash root directory by _id or id', () => {
    expect(isTrashedDocument({ _id: TRASH_DIR_ID })).toBe(true)
    expect(isTrashedDocument({ id: TRASH_DIR_ID })).toBe(true)
  })

  it('identifies items directly in trash by dir_id', () => {
    expect(isTrashedDocument({ _id: 'doc-1', dir_id: TRASH_DIR_ID })).toBe(true)
  })

  it('identifies files marked with trashed: true', () => {
    expect(isTrashedDocument({ _id: 'file-1', trashed: true })).toBe(true)
  })

  it('identifies folders by exact trash path or descendants under trash path', () => {
    expect(isTrashedDocument({ _id: 'trash-dir', path: TRASH_DIR_PATH })).toBe(
      true
    )
    expect(
      isTrashedDocument({
        _id: 'folder-1',
        path: `${TRASH_DIR_PATH}/Project`
      })
    ).toBe(true)
    expect(
      isTrashedDocument({
        _id: 'folder-2',
        path: `${TRASH_DIR_PATH}/Project/Sub`
      })
    ).toBe(true)
  })

  it('does not falsely match folders whose name happens to start with trash prefix', () => {
    expect(
      isTrashedDocument({
        _id: 'archive',
        path: '/.cozy_trash_backup',
        dir_id: ROOT_DIR_ID
      })
    ).toBe(false)
  })

  it('returns false for healthy files and folders', () => {
    expect(
      isTrashedDocument({
        _id: 'root',
        path: '/',
        dir_id: null
      })
    ).toBe(false)
    expect(
      isTrashedDocument({
        _id: 'projects',
        type: 'directory',
        path: '/Projects',
        dir_id: ROOT_DIR_ID
      })
    ).toBe(false)
    expect(
      isTrashedDocument({
        _id: 'invoice',
        type: 'file',
        dir_id: 'projects',
        trashed: false
      })
    ).toBe(false)
  })
})
