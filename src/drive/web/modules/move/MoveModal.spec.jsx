import React from 'react'
import { shallow } from 'enzyme'

import { MoveModal } from './MoveModal'
import CozyClient from 'cozy-client'
import { CozyFile } from 'cozy-doctypes'

jest.mock('cozy-doctypes')
jest.mock('cozy-stack-client')

CozyFile.doctype = 'io.cozy.files'

const restoreSpy = jest.fn()
const collectionSpy = jest.fn(() => ({
  restore: restoreSpy
}))
const fakeContext = {
  client: new CozyClient({
    stackClient: {
      collection: collectionSpy
    }
  }),
  t: jest.fn()
}

describe('MoveModal component', () => {
  const setupComponent = (entries = []) => {
    const props = { entries }
    return shallow(<MoveModal {...props} />, {
      context: fakeContext
    })
  }

  describe('cancelMove', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    it('should move items back to their previous location', async () => {
      const entries = [
        { _id: 'bill_201901.pdf', dir_id: '/bills' },
        { _id: 'bill_201902.pdf', dir_id: '/bills' }
      ]
      const component = setupComponent(entries)
      await component.instance().cancelMove(entries)
      expect(CozyFile.move).toHaveBeenCalledWith('bill_201901.pdf', {
        folderId: '/bills'
      })
      expect(CozyFile.move).toHaveBeenCalledWith('bill_201902.pdf', {
        folderId: '/bills'
      })
      expect(restoreSpy).not.toHaveBeenCalled()
    })

    it('should restore files that have been trashed due to conflicts', async () => {
      const component = setupComponent()
      component.setState({
        trashedFiles: ['trashed-1', 'trashed-2']
      })

      await component.instance().cancelMove([])
      expect(collectionSpy).toHaveBeenCalledWith('io.cozy.files')
      expect(restoreSpy).toHaveBeenCalledWith('trashed-1')
      expect(restoreSpy).toHaveBeenCalledWith('trashed-2')
    })
  })
})
