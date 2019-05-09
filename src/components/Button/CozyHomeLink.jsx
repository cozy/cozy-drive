import React from 'react'
import PropTypes from 'prop-types'
import { ButtonLink } from 'cozy-ui/react'
import styles from './index.styl'
import getHomeLinkHref from './getHomeLinkHref'

const CozyHomeLink = ({ from, embedInCozyBar = false, t, size, className }) => (
  <ButtonLink
    label={t('Share.create-cozy')}
    icon="cozy-negative"
    className={embedInCozyBar ? styles['bar-homelink'] : className}
    href={getHomeLinkHref(from)}
    size={size}
  />
)

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
