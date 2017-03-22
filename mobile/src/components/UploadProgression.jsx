import React from 'react'
import classNames from 'classnames'
import styles from '../styles/uploadprogression'
import { translate } from '../../../src/lib/I18n'

const UploadProgression = ({t, message, messageData}) => {
  if (!message) {
    return null
  } else {
    return (
      <div className={styles['coz-alerter']}>
        <div
          className={classNames(
            styles['coz-alert'],
            styles[`coz-alert--info`]
          )}
        >
          <p>
            <span class={styles['fil-loading']} />
            {t(message, messageData)}
          </p>
        </div>
      </div>
    )
  }
}

export default translate()(UploadProgression)
