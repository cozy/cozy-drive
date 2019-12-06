import React from 'react'
import { shallow } from 'enzyme'

import { DumbUpload, generateForQueue } from './'
import CozyClient from 'cozy-client'

jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))

const tSpy = jest.fn()
const uploadFilesFromNativeSpy = jest.fn()

const cozyClient = new CozyClient({})

describe('OpenWith component Modal', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  const defaultItems = [{ name: 'File1.pdf' }]

  const setupComponent = () => {
    const props = {
      client: cozyClient,
      t: tSpy,
      uploadFilesFromNative: uploadFilesFromNativeSpy
    }
    return shallow(<DumbUpload {...props} />)
  }

  describe('generateForQueue', () => {
    it('should generat the right object for the Drive queue', () => {
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
      component.setState({ items: defaultItems, folderId })

      component.instance().callbackSuccess = jest.fn()
      await component.instance().uploadFiles()
      const genetaredForQueue = generateForQueue(defaultItems)
      expect(uploadFilesFromNativeSpy).toHaveBeenCalledWith(
        genetaredForQueue,
        folderId,
        component.instance().callbackSuccess
      )
    })
  })
})
