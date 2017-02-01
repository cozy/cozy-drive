import React from 'react'
import { shallow } from 'enzyme'
import { Settings } from '../../mobile/src/containers/Settings'

describe('Settings', () => {
  it('should contain version number', () => {
    const t = key => key
    const version = '1.0.0'
    const SettingsComponent = <Settings t={t} version={version} />
    const component = shallow(SettingsComponent)

    expect(component.find('#version').text()).toEqual(version)
  })
  it('should contain server url', () => {
    const t = key => key
    const serverUrl = 'https://localhost'
    const SettingsComponent = <Settings t={t} serverUrl={serverUrl} />
    const component = shallow(SettingsComponent)

    expect(component.find('#serverUrl').text()).toEqual(serverUrl)
  })
})
