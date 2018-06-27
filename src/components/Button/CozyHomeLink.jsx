import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/react/I18n'
import { ButtonLink } from 'cozy-ui/react'
import styles from './index.styl'

const CozyHomeLink = ({ from, embedInCozyBar = false }, { t }) => (
  <ButtonLink
    subtle
    label={t('Share.create-cozy')}
    icon="cozy-negative"
    className={embedInCozyBar ? styles['bar-homelink'] : ''}
    href={` https://manager.cozycloud.cc/cozy/create${
      from ? `?pk_campaign=${encodeURIComponent(from)}` : ''
    }`}
  />
)

CozyHomeLink.propTypes = {
  from: PropTypes.string,
  embedInCozyBar: PropTypes.bool
}

CozyHomeLink.defaultProps = {
  from: ''
}

export default translate()(CozyHomeLink)
