import React from 'react'
import { shallow } from 'enzyme'
import { UploadStatus } from './MediaBackupProgression'

const render = props => {
  const wrapper = shallow(<UploadStatus t={x => x} {...props} />)
  return wrapper
}

describe('MediaBackupProgression', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should not render anything when the backup is disabled', () => {
    expect(render({ isEnabled: false }).type()).toBe(null)
  })

  it('should render stg when the backup is in preparation', () => {
    expect(
      render({ isEnabled: true, isPreparing: true }).find('UploadPreparing')
    ).toHaveLength(1)
  })

  it('should render the progression when uploading', () => {
    const comp = render({
      isEnabled: true,
      isUploading: true,
      current: 5,
      total: 10
    })
    expect(comp.find('UploadProgression')).toHaveLength(1)
    expect(comp.find({ current: 5, total: 10 })).toHaveLength(1)
  })

  it('should render stg when uptodate', () => {
    expect(render({ isEnabled: true }).find('UploadUptodate')).toHaveLength(1)
  })
})
