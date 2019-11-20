import { mount } from 'enzyme'
import React from 'react'

import { RealtimeFiles } from './RealtimeFiles'

global.cozy = {
  client: {
    offline: {
      getDatabase: jest.fn()
    }
  }
}

jest.mock('cozy-ui/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))

jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))

jest.mock('cozy-realtime', () => {
  return class {
    constructor() {
      this.subscribe = jest.fn()
    }
  }
})

describe('RealTimeFiles', () => {
  let client,
    updateFile,
    updateOfflineFileCopyIfNecessary,
    addFile,
    deleteFile,
    component
  const setup = () => {
    client = {
      stackClient: {
        token: {
          token: '1'
        },
        uri: 'http://mycozy.cloud'
      }
    }
    //eslint-disable-next-line
    const files = [
      {
        id: '2',
        _id: '2'
      },
      {
        id: '3',
        _id: '3'
      }
    ]
    updateFile = jest.fn()
    updateOfflineFileCopyIfNecessary = jest.fn()
    addFile = jest.fn()
    deleteFile = jest.fn()
    component = mount(
      <RealtimeFiles
        client={client}
        files={files}
        updateFile={updateFile}
        addFile={addFile}
        deleteFile={deleteFile}
        updateOfflineFileCopyIfNecessary={updateOfflineFileCopyIfNecessary}
      />
    )
  }
  beforeEach(() => {
    jest.clearAllMocks()
    setup()
  })
  it('should call Update', () => {
    //Doc was present and in the current view => updateFile
    component.instance().isInCurrentView = jest.fn().mockReturnValue(true)

    component.instance().onDocumentChange({ _id: '2' })
    expect(updateFile).toBeCalled()
    expect(updateOfflineFileCopyIfNecessary).toBeCalled()
  })
  it('should call deleteFile', () => {
    //Doc was present, but not the current view => delete
    component.instance().isInCurrentView = jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValue(true)
    component.instance().onDocumentChange({ _id: '2' })
    expect(deleteFile).toBeCalled()
  })
  it('should call addFile', () => {
    //Doc was not present, but the current view => add
    component.instance().isInCurrentView = jest.fn().mockReturnValue(true)
    component.instance().onDocumentChange({ _id: '4' })
    expect(addFile).toBeCalled()
  })
})
