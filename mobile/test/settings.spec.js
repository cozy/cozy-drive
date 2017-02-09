import React from 'react'
import { render } from 'enzyme'
import { Settings } from '../../mobile/src/containers/Settings'

describe('Settings', () => {
  it('should contain version number', () => {
    const t = key => key
    const version = '1.0.0'
    const SettingsComponent = <Settings t={t} version={version} />
    const component = render(SettingsComponent)

    expect(component.find('#version').text()).toEqual(version)
  })
  it('should contain server url', () => {
    const t = key => key
    const serverUrl = 'https://localhost'
    const SettingsComponent = <Settings t={t} serverUrl={serverUrl} />
    const component = render(SettingsComponent)

    expect(component.find('#serverUrl').text()).toEqual(serverUrl)
  })
  it('should contain backup image', () => {
    const t = key => key
    const onSetBackupImages = () => {}
    const SettingsComponent = <Settings t={t} setBackupImages={onSetBackupImages} backupImages />
    const component = render(SettingsComponent)
    const input = component.find('#backupImages').children().first()
    expect(input.prop('checked')).toBeTruthy()
  })
})
