import React from 'react'
import PropTypes from 'prop-types'
import { ButtonLink, useI18n } from 'cozy-ui/transpiled/react'
import getHomeLinkHref from 'components/Button/getHomeLinkHref'
import CozyHomeLinkIcon from 'components/Button/CozyHomeLinkIcon'

const CozyHomeLink = ({ from, className }) => {
  const { t } = useI18n()
  return (
    <ButtonLink
      label={t('Share.create-cozy')}
      icon={CozyHomeLinkIcon}
      className={className}
      href={getHomeLinkHref(from)}
      size={'normal'}
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
