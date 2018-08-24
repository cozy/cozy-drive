import React from 'react'
import configureStore from 'redux-mock-store'
import { shallow } from 'enzyme'

const render = () => {
  const MediaBackupProgression = require('./MediaBackupProgression').default
  const wrapper = shallow(<MediaBackupProgression />, {
    context: { t: k => k, store: configureStore()({}) }
  })
  // we need to dive into the connect()ed and the translate()ed wrappers
  return wrapper.dive().dive()
}

const mockSelectors = (providedSelectors = {}) => {
  const { isImagesBackupOn = () => true, ...selectors } = providedSelectors
  jest.doMock('drive/mobile/modules/settings/duck', () => ({
    isImagesBackupOn,
    getServerUrl: () => 'http://cozy.tools:8080'
  }))
  jest.doMock('./duck/reducer', () => ({
    isPreparingBackup: () => false,
    isUploading: () => false,
    isAborted: () => false,
    isQuotaReached: () => false,
    getUploadStatus: () => ({}),
    ...selectors
  }))
}

describe('MediaBackupProgression', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should not render anything when the backup is disabled', () => {
    mockSelectors({
      isImagesBackupOn: () => false
    })
    expect(render().type()).toBe(null)
  })

  it('should render stg when the backup is in preparation', () => {
    mockSelectors({
      isPreparingBackup: () => true
    })
    expect(render().find('UploadPreparing')).toHaveLength(1)
  })

  it('should render the progression when uploading', () => {
    mockSelectors({
      isUploading: () => true,
      getUploadStatus: () => ({ current: 5, total: 10 })
    })
    expect(render().find('UploadProgression')).toHaveLength(1)
    expect(render().find({ current: 5, total: 10 })).toHaveLength(1)
  })

  it('should render stg when uptodate', () => {
    mockSelectors()
    expect(render().find('UploadUptodate')).toHaveLength(1)
  })
})
