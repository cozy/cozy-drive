import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Hammer from '@egjs/hammerjs'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import SettingCategory, { ELEMENT_TEXT } from './SettingCategory'
import { getServerUrl } from '../duck'

class About extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.gesturesHandler = new Hammer.Manager(this.versionNumber)
    this.gesturesHandler.add(new Hammer.Tap({ event: 'singletap' }))
    this.gesturesHandler.on('singletap', this.props.onTap)
  }

  componentWillUnmount() {
    this.gesturesHandler && this.gesturesHandler.destroy()
  }

  render() {
    const { t, version, serverUrl } = this.props

    return (
      <SettingCategory
        title={t('mobile.settings.about.title')}
        elements={[
          {
            type: ELEMENT_TEXT,
            label: t('mobile.settings.about.account'),
            value: <a href={serverUrl}>{serverUrl}</a>
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

About.propTypes = {
  t: PropTypes.func.isRequired,
  version: PropTypes.string.isRequired,
  serverUrl: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  version: window.navigator.appInfo ? window.navigator.appInfo.version : 'dev',
  serverUrl: getServerUrl(state)
})

export default connect(mapStateToProps)(translate()(About))
