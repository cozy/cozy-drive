import React from 'react'
import CozyClient from 'cozy-client'
import { shallow } from 'enzyme'

import { SharingFetcher } from './SharingsContainer'
import { ROOT_DIR_ID } from 'drive/constants/config.js'

jest.mock('cozy-ui/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))

const all = jest
  .fn()
  .mockName('all')
  .mockResolvedValue({ data: [] })
const statByPathSpy = jest.fn().mockName('statByPath')
const updateFileSpy = jest.fn().mockName('updateFile')
const fakeClient = {
  collection: () => ({
    all: all,
    statByPath: statByPathSpy,
    updateFile: updateFileSpy
  })
}

jest.mock('cozy-client', () => {
  const automaticMock = jest.genMockFromModule('cozy-client')
  return {
    ...automaticMock,
    // we need queryConnect to return a function
    queryConnect: jest.fn().mockImplementation(() => () => {})
  }
})

describe('SharingFetcher component', () => {
  describe('componentDidMount', () => {
    it('should call fetchSharedDocuments', () => {
      const props = {
        sharedDocuments: [],
        params: {},
        startFetch: jest.fn(),
        fetchSuccess: jest.fn(),
        client: fakeClient
      }
      const wrapper = shallow(<SharingFetcher {...props} />, {
        disableLifecycleMethod: true,
        context: {
          t: jest.fn(() => 'whatever')
        }
      })
      const fetchSharedDocumentsSpy = jest.fn()
      wrapper.instance().fetchSharedDocuments = fetchSharedDocumentsSpy
      wrapper.instance().componentDidMount()
      expect(fetchSharedDocumentsSpy).toHaveBeenCalled()
    })
  })

  describe('componentDidUpdate', () => {
    it('should fetch shared documents if there are new sharings', async () => {
      const props = {
        sharedDocuments: ['foo'],
        params: {},
        startFetch: jest.fn(),
        fetchSuccess: jest.fn(),
        client: fakeClient
      }
      const nextProps = {
        sharedDocuments: ['foo', 'bar'],
        params: {},
        startFetch: jest.fn()
      }
      const wrapper = shallow(<SharingFetcher {...props} />, {
        disableLifecycleMethod: true,
        context: {
          t: jest.fn(() => 'whatever')
        }
      })
      const fetchSharedDocumentsSpy = jest.fn()
      wrapper.instance().fetchSharedDocuments = fetchSharedDocumentsSpy
      await wrapper.instance().componentDidUpdate(nextProps)
      expect(fetchSharedDocumentsSpy).toHaveBeenCalled()
    })

    it('should not fetch shared documents if there are no new sharings', async () => {
      const props = {
        sharedDocuments: ['foo'],
        params: {},
        startFetch: jest.fn(),
        fetchSuccess: jest.fn(),
        client: fakeClient
      }
      const nextProps = {
        sharedDocuments: ['foo'],
        params: {},
        startFetch: jest.fn(),
        fetchSuccess: jest.fn()
      }
      const wrapper = shallow(<SharingFetcher {...props} />, {
        disableLifecycleMethod: true,
        context: {
          t: jest.fn(() => 'whatever')
        }
      })
      const fetchSharedDocumentsSpy = jest.fn()
      wrapper.instance().fetchSharedDocuments = fetchSharedDocumentsSpy
      await wrapper.instance().componentDidUpdate(nextProps)
      expect(fetchSharedDocumentsSpy).not.toHaveBeenCalled()
    })
  })

  describe('fetchSharedDocuments', () => {
    const client = new CozyClient()
    const fetchSuccessSpy = jest.fn()
    const fetchFailureSpy = jest.fn()
    const translateSpy = jest.fn(() => 'whatever')

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should fetch shared documents with their paths', async () => {
      const fakeData = [
        { dir_id: '', id: ROOT_DIR_ID, name: 'root', path: '/' },
        { dir_id: ROOT_DIR_ID, id: '1', name: 'one' },
        { dir_id: '3', id: '2', name: 'two' },
        { dir_id: '4', id: '3', name: 'three', path: '/my/dir' },
        { dir_id: ROOT_DIR_ID, id: '4', name: 'four', path: '/my' }
      ]
      client.collection.mockImplementation(() => ({
        all: jest.fn(({ keys }) =>
          Promise.resolve({
            data: fakeData.filter(item => keys.indexOf(item.id) > -1)
          })
        )
      }))

      const props = {
        fetchSuccess: fetchSuccessSpy,
        fetchFailure: fetchFailureSpy,
        sharedDocuments: ['1', '2'],
        startFetch: jest.fn(),
        store: {},
        client
      }

      const wrapper = shallow(<SharingFetcher {...props} />, {
        disableLifecycleMethod: true,
        context: {
          t: translateSpy
        }
      })
      wrapper.setState({ error: new Error('Houston, we have a problem') })
      await wrapper.instance().fetchSharedDocuments()

      expect(fetchFailureSpy).not.toHaveBeenCalled()
      const expectedFiles = [
        { dir_id: ROOT_DIR_ID, id: '1', name: 'one', path: '/' },
        { dir_id: '3', id: '2', name: 'two', path: '/my/dir' }
      ]
      expect(fetchSuccessSpy).toHaveBeenCalledWith(expectedFiles)
      expect(wrapper.state('error')).toBeNull()
    })

    it('should fail on rejected promise', async () => {
      const failedToGetFilesError = new Error('Failed to get files')
      client.collection.mockImplementation(() => ({
        all: jest.fn().mockRejectedValue(failedToGetFilesError)
      }))

      const props = {
        fetchSuccess: fetchSuccessSpy,
        fetchFailure: fetchFailureSpy,
        sharedDocuments: ['1', '2'],
        startFetch: jest.fn(),
        store: {},
        client
      }

      const wrapper = shallow(<SharingFetcher {...props} />, {
        disableLifecycleMethod: true,
        context: {
          t: translateSpy
        }
      })
      await wrapper.instance().fetchSharedDocuments()

      expect(fetchSuccessSpy).not.toHaveBeenCalled()
      expect(fetchFailureSpy).toHaveBeenCalledWith(failedToGetFilesError)
      expect(wrapper.state('error')).toEqual(failedToGetFilesError)
    })
  })
})
