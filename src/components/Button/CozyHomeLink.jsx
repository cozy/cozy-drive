import PropTypes from 'prop-types'
import React from 'react'

import { ButtonLink, useI18n } from 'cozy-ui/transpiled/react'

import CozyHomeLinkIcon from 'components/Button/CozyHomeLinkIcon'
import { HOME_LINK_HREF } from 'constants/config'

const CozyHomeLink = ({ className }) => {
  const { t } = useI18n()
  return (
    <ButtonLink
      label={t('Share.create-cozy')}
      icon={CozyHomeLinkIcon}
      className={className}
      href={HOME_LINK_HREF}
      size="normal"
    />
  )
}

CozyHomeLink.propTypes = {
  from: PropTypes.string
}

CozyHomeLink.defaultProps = {
  from: ''
}

export default CozyHomeLink
