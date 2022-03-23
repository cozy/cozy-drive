import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { withClient } from 'cozy-client'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import SettingCategory, { ELEMENT_BUTTON } from './SettingCategory'
import {
  unlink,
  getClientSettings
} from 'drive/mobile/modules/authorization/duck'

export class Unlink extends Component {
  render() {
    const { t, unlink, clientSettings, client } = this.props
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
Unlink.propTypes = {
  t: PropTypes.func,
  unlink: PropTypes.func,
  clientSettings: PropTypes.object,
  router: PropTypes.object
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
  connect(mapStateToProps, mapDispatchToProps)(translate()(withClient(Unlink)))
)
