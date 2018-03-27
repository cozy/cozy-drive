import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/react/I18n'
import { ButtonLink } from 'cozy-ui/react'

const CozyHomeLink = ({ t, from }) => (
  <ButtonLink
    label={t('Share.create-cozy')}
    href={`https://cozy.io/try-it?from=${encodeURIComponent(from)}`}
  />
)

CozyHome.propTypes = {
  t: PropTypes.func.isRequired,
  from: PropTypes.string
}

CozyHome.defaultProps = {
  from: ''
}

export default translate()(CozyHomeLink)
