import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from 'sharing/components/recipient.styl'

const Identity = ({ name, details }) => (
  <div className={classNames(styles['recipient-idents'], 'u-ml-1')}>
    <div className={styles['recipient-user']}>{name}</div>
    <div className={styles['recipient-details']}>{details}</div>
  </div>
)

Identity.propTypes = {
  name: PropTypes.string.isRequired,
  details: PropTypes.string
}

Identity.defaultProps = {
  details: '-'
}

export default Identity
