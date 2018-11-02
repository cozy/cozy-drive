import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import SettingCategory, { ELEMENT_BUTTON } from './SettingCategory'
import Modal from 'cozy-ui/react/Modal'
import {
  unlink,
  getClientSettings
} from 'drive/mobile/modules/authorization/duck'

class Unlink extends Component {
  state = {
    showConfirmation: false
  }

  showConfirmation = () => {
    this.setState({ showConfirmation: true })
  }

  hideConfirmation = () => {
    this.setState({ showConfirmation: false })
  }

  render() {
    const { t, unlink, clientSettings } = this.props
    const { showConfirmation } = this.state
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
              onClick: this.showConfirmation
            }
          ]}
        />
        {showConfirmation && (
          <Modal
            title={t('mobile.settings.unlink.confirmation.title')}
            description={t('mobile.settings.unlink.confirmation.description')}
            secondaryType="secondary"
            secondaryText={t('mobile.settings.unlink.confirmation.cancel')}
            secondaryAction={this.hideConfirmation}
            primaryType="danger"
            primaryText={t('mobile.settings.unlink.confirmation.unlink')}
            primaryAction={() => unlink(client, clientSettings)}
          />
        )}
      </div>
    )
  }
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
