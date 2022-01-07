import React from 'react'
import { shallow } from 'enzyme'

import { DumbUpload, generateForQueue } from './'

jest.mock('cozy-keys-lib', () => ({
  withVaultClient: jest.fn().mockReturnValue({})
}))

const tSpy = jest.fn()
const uploadFilesFromNativeSpy = jest.fn()

describe('OpenWith component Modal', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  const defaultItems = [{ name: 'File1.pdf' }]

  const setupComponent = () => {
    const props = {
      client: {},
      vaultClient: {},
      t: tSpy,
      uploadFilesFromNative: uploadFilesFromNativeSpy,
      stopMediaBackup: jest.fn(),
      router: jest.fn()
    }
    return shallow(<DumbUpload {...props} />)
  }

  describe('generateForQueue', () => {
    it('should generate the right object for the Drive queue', () => {
      const genetaredForQueue = generateForQueue(defaultItems)
      expect(genetaredForQueue).toEqual([
        { file: defaultItems[0], isDirectory: false }
      ])
    })
  })
  describe('Upload files', () => {
    it('should call uploadFileFromNative with the right arguments', async () => {
      const component = setupComponent()
      const folderId = 'io.cozy.root'
      component.setState({ items: defaultItems, folder: { _id: folderId } })

      component.instance().callbackSuccess = jest.fn()
      await component.instance().uploadFiles()
      const genetaredForQueue = generateForQueue(defaultItems)
      expect(uploadFilesFromNativeSpy).toHaveBeenCalledWith(
        genetaredForQueue,
        folderId,
        component.instance().callbackSuccess,
        { client: {}, vaultClient: {} }
      )
    })
  })
})
