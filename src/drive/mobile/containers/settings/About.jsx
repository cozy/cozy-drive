import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import SettingCategory, { ELEMENT_TEXT } from '../../components/SettingCategory'
import Hammer from 'hammerjs'

class About extends Component {
  componentDidMount() {
    this.gesturesHandler = new Hammer.Manager(this.versionNumber)
    this.gesturesHandler.add(new Hammer.Tap({ event: 'singletap' }))
    this.gesturesHandler.on('singletap', this.props.onTap)
  }

  componentWillUnmount() {
    this.gesturesHandler.destroy()
  }

  render({ t, version, serverUrl }) {
    return (
      <SettingCategory
        title={t('mobile.settings.about.title')}
        elements={[
          {
            type: ELEMENT_TEXT,
            label: t('mobile.settings.about.account'),
            value: <a href="{serverUrl}">{serverUrl}</a>
          },
          {
            type: ELEMENT_TEXT,
            label: t('mobile.settings.about.app_version'),
            value: (
              <span
                ref={versionNumber => {
                  this.versionNumber = versionNumber
                }}
              >
                {version}
              </span>
            )
          }
        ]}
      />
    )
  }
}

const mapStateToProps = state => ({
  version: window.navigator.appInfo ? window.navigator.appInfo.version : 'dev',
  serverUrl: state.mobile.settings.serverUrl
})

export default connect(mapStateToProps)(translate()(About))
