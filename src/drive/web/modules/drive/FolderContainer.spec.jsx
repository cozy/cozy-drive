import { shallow } from 'enzyme'
import React from 'react'

jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))

import FolderContainer from './FolderContainer'

describe('FolderContainer', () => {
  it('should match the snapshot', () => {
    const wrapper = shallow(
      <FolderContainer
        additionalProp="foobar"
        canSort={true}
        canDrop={true}
        canUpload={true}
        canCreateFolder={true}
        canMove={true}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
