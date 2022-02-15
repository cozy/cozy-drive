import React from 'react'
import { shallow } from 'enzyme'

import CozyClient from 'cozy-client'
import { CozyFile } from 'models'

import { MoveModal } from './MoveModal'

jest.mock('cozy-client/dist/utils', () => ({
  cancelable: jest.fn().mockImplementation(promise => promise)
}))

jest.mock('cozy-doctypes')
jest.mock('cozy-stack-client')

CozyFile.doctype = 'io.cozy.files'

const getSpy = jest.fn().mockResolvedValue({
  data: { id: 'fakeDoc', _type: 'io.cozy.files' }
})
const onCloseSpy = jest.fn()
const restoreSpy = jest.fn()
const tSpy = jest.fn()
const collectionSpy = jest.fn(() => ({
  get: getSpy,
  restore: restoreSpy
}))
const cozyClient = new CozyClient({
  stackClient: {
    collection: collectionSpy,
    on: jest.fn()
  }
})

describe('MoveModal component', () => {
  const defaultEntries = [
    { _id: 'bill_201901', dir_id: 'bills', name: 'bill_201901.pdf' },
    { _id: 'bill_201902', dir_id: 'bills', name: 'bill_201902.pdf' },
    // shared file:
    { _id: 'bill_201903', dir_id: 'bills', name: 'bill_201903.pdf' }
  ]

  const sharingState = {
    sharedPaths: ['/sharedFolder', '/bills/bill_201903.pdf']
  }

  const setupComponent = (entries = defaultEntries) => {
    const props = {
      client: cozyClient,
      displayedFolder: { _id: 'bills' },
      entries,
      onClose: onCloseSpy,
      sharingState,
      t: tSpy,
      classes: { paper: {} },
      breakpoints: { isMobile: false }
    }
    return shallow(<MoveModal {...props} />)
  }

  describe('moveEntries', () => {
    it('should move entries to destination', async () => {
      const component = setupComponent(defaultEntries, sharingState)
      component.setState({ folderId: 'destinationFolder' })
      CozyFile.getFullpath.mockImplementation((destinationFolder, name) =>
        Promise.resolve(
          name === 'bill_201903.pdf' ? '/bills/bill_201903.pdf' : '/whatever'
        )
      )
      CozyFile.move.mockImplementation(id => {
        if (id === 'bill_201902') {
          return Promise.resolve({
            deleted: 'other_bill_201902',
            moved: { id }
          })
        } else {
          return Promise.resolve({
            deleted: null,
            moved: { id }
          })
        }
      })
      const cb = jest.fn()
      await component.instance().moveEntries(cb)
      expect(CozyFile.move).toHaveBeenNthCalledWith(
        1,
        'bill_201901',
        {
          folderId: 'destinationFolder'
        },
        true
      )
      // delete destination file
      expect(CozyFile.move).toHaveBeenNthCalledWith(
        2,
        'bill_201902',
        {
          folderId: 'destinationFolder'
        },
        true
      )
      // don't force a shared file
      expect(CozyFile.move).toHaveBeenNthCalledWith(
        3,
        'bill_201903',
        {
          folderId: 'destinationFolder'
        },
        false
      )
      expect(onCloseSpy).toHaveBeenCalled()
      expect(cb).toHaveBeenCalled()
      // TODO: check that trashedFiles are passed to cancel button
    })
  })

  describe('cancelMove', () => {
    it('should move items back to their previous location', async () => {
      const component = setupComponent()
      const callback = jest.fn()
      await component.instance().cancelMove(defaultEntries, [], callback)
      expect(CozyFile.move).toHaveBeenCalledWith('bill_201901', {
        folderId: 'bills'
      })
      expect(CozyFile.move).toHaveBeenCalledWith('bill_201902', {
        folderId: 'bills'
      })
      expect(restoreSpy).not.toHaveBeenCalled()
      expect(callback).toHaveBeenCalled()
    })

    it('should restore files that have been trashed due to conflicts', async () => {
      const callback = jest.fn()
      const component = setupComponent()
      await component
        .instance()
        .cancelMove([], ['trashed-1', 'trashed-2'], callback)
      expect(collectionSpy).toHaveBeenCalledWith('io.cozy.files')
      expect(restoreSpy).toHaveBeenCalledWith('trashed-1')
      expect(restoreSpy).toHaveBeenCalledWith('trashed-2')
      expect(callback).toHaveBeenCalled()
    })
  })
})
