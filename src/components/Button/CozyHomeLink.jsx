import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/react/I18n'
import { ButtonLink } from 'cozy-ui/react'

const CozyHomeLink = ({ from }, { t }) => (
  <ButtonLink
    label={t('Share.create-cozy')}
    href={` https://manager.cozycloud.cc/cozy/create${
      from ? `?pk_campaign=${encodeURIComponent(from)}` : ''
    }`}
  />
)

CozyHomeLink.propTypes = {
  from: PropTypes.string
}

CozyHomeLink.defaultProps = {
  from: ''
}

export default translate()(CozyHomeLink)
