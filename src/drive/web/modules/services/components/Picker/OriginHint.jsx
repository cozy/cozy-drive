import React from 'react'
import PropTypes from 'prop-types'
import styles from './picker.styl'

const OriginHint = ({ title, icon }, { t }) => (
  <div className={styles['origin-info']}>
    <div>
      {icon && <img className={styles['origin-info-icon']} src={icon} />}
    </div>
    <div className={styles['origin-info-text']}>
      <h2>{title}</h2>
      <p>{t('intents.picker.instructions')}</p>
    </div>
  </div>
)

OriginHint.contextTypes = {
  t: PropTypes.func.isRequired
}

export default OriginHint
