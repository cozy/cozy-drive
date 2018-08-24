import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import SettingCategory, {
  ELEMENT_BUTTON
} from '../../components/SettingCategory'
import Modal from 'cozy-ui/react/Modal'
import {
  showUnlinkConfirmation,
  hideUnlinkConfirmation,
  unlink
} from '../../actions/unlink'
import { getClientSettings } from '../../../reducers/settings'

export const Unlink = (
  {
    t,
    showUnlinkConfirmation,
    hideUnlinkConfirmation,
    displayUnlinkConfirmation,
    unlink,
    clientSettings
  },
  { client }
) => (
  <div>
    <SettingCategory
      title={t('mobile.settings.unlink.title')}
      elements={[
        {
          type: ELEMENT_BUTTON,
          description: t('mobile.settings.unlink.description'),
          text: t('mobile.settings.unlink.button'),
          theme: 'danger-outline',
          onClick: showUnlinkConfirmation
        }
      ]}
    />
    {displayUnlinkConfirmation && (
      <Modal
        title={t('mobile.settings.unlink.confirmation.title')}
        description={t('mobile.settings.unlink.confirmation.description')}
        secondaryType="secondary"
        secondaryText={t('mobile.settings.unlink.confirmation.cancel')}
        secondaryAction={hideUnlinkConfirmation}
        primaryType="danger"
        primaryText={t('mobile.settings.unlink.confirmation.unlink')}
        primaryAction={() => unlink(client, clientSettings)}
      />
    )}
  </div>
)

const mapStateToProps = state => ({
  displayUnlinkConfirmation: state.mobile.ui.displayUnlinkConfirmation,
  clientSettings: getClientSettings(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  showUnlinkConfirmation: () => dispatch(showUnlinkConfirmation()),
  hideUnlinkConfirmation: () => dispatch(hideUnlinkConfirmation()),
  unlink: (client, clientSettings) => {
    dispatch(unlink(client, clientSettings))
    ownProps.router.replace('/onboarding')
  }
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(translate()(Unlink))
)
