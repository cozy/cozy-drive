import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import SettingCategory, { ELEMENT_BUTTON } from './SettingCategory'
import {
  unlink,
  getClientSettings
} from 'drive/mobile/modules/authorization/duck'

export class Unlink extends Component {
  static contextTypes = {
    client: PropTypes.func.isRequired
  }
  render() {
    const { t, unlink, clientSettings } = this.props
    const { client } = this.context
    return (
      <div>
        <SettingCategory
          title={t('mobile.settings.unlink.title')}
          elements={[
            {
              type: ELEMENT_BUTTON,
              description: t('mobile.settings.unlink.description'),
              text: t('mobile.settings.unlink.button'),
              theme: 'danger-outline',
              onClick: () => unlink(client, clientSettings)
            }
          ]}
        />
      </div>
    )
  }
}
Unlink.PropTypes = {
  t: PropTypes.func,
  unlink: PropTypes.func,
  clientSettings: PropTypes.object,
  router: PropTypes.object
}
Unlink.contextTypes = {
  client: PropTypes.func
}

const mapStateToProps = state => ({
  clientSettings: getClientSettings(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  unlink: (client, clientSettings) => {
    dispatch(unlink(client, clientSettings))
    ownProps.router.replace('/onboarding')
  }
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(translate()(Unlink))
)
