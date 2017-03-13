import styles from '../styles/errorComponent'

import React from 'react'
import { translate } from '../lib/I18n'

export const ErrorComponent = ({ t, errorType }) => {
  return (
    <div>
      {errorType === 'albums' &&
        <div className={styles['pho-error']}>
          <h2>{ t('Error.albums_title') }</h2>
          <button
            role='button'
            className='coz-btn coz-btn--regular'
            onClick={() => window.location.reload()}
          >
            {t('Error.refresh')}
          </button>
        </div>
      }
    </div>
  )
}

export default translate()(ErrorComponent)
