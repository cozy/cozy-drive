import React from 'react'
import classNames from 'classnames'
import styles from '../styles/uploadprogression'
import { translate } from 'cozy-ui/react/I18n'

import Spinner from 'cozy-ui/react/Spinner'

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
            <Spinner color='white' />
            {t(message, messageData)}
          </p>
        </div>
      </div>
    )
  }
}

export default translate()(UploadProgression)
