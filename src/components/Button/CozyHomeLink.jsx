import React from 'react'
import PropTypes from 'prop-types'
import { ButtonLink, useI18n } from 'cozy-ui/transpiled/react'
import styles from 'components/Button/index.styl'
import getHomeLinkHref from 'components/Button/getHomeLinkHref'
import CozyHomeLinkIcon from 'components/Button/CozyHomeLinkIcon'

const CozyHomeLink = ({ from, embedInCozyBar = false, size, className }) => {
  const { t } = useI18n()
  return (
    <ButtonLink
      label={t('Share.create-cozy')}
      icon={CozyHomeLinkIcon}
      className={embedInCozyBar ? styles['bar-homelink'] : className}
      href={getHomeLinkHref(from)}
      size={size}
    />
  )
}

CozyHomeLink.propTypes = {
  from: PropTypes.string,
  embedInCozyBar: PropTypes.bool,
  t: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['tiny', 'small', 'large', 'normal'])
}

CozyHomeLink.defaultProps = {
  from: '',
  size: 'normal'
}

export default CozyHomeLink
