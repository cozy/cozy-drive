import React from 'react'
import PropTypes from 'prop-types'
import { useClient } from 'cozy-client'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import SettingCategory, { ELEMENT_BUTTON } from './SettingCategory'
import {
  unlink,
  getClientSettings
} from 'drive/mobile/modules/authorization/duck'

export const Unlink = ({ unlink, clientSettings }) => {
  const { t } = useI18n()
  const client = useClient()
  const navigate = useNavigate()
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
            onClick: () => unlink(client, clientSettings, navigate)
          }
        ]}
      />
    </div>
  )
}
Unlink.propTypes = {
  unlink: PropTypes.func,
  clientSettings: PropTypes.object
}

const mapStateToProps = state => ({
  clientSettings: getClientSettings(state)
})

const mapDispatchToProps = dispatch => ({
  unlink: (client, clientSettings, navigate) => {
    dispatch(unlink(client, clientSettings))
    navigate('/onboarding', { replace: true })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Unlink)
