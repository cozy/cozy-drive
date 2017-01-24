import styles from '../styles/empty'

import React from 'react'
import { translate } from '../lib/I18n'

export const Empty = ({ t, emptyType }) => {
  return (
    <div>
      {emptyType === 'photos' &&
        <div className={styles['pho-empty']}>
          <h2>{ t('Empty.photos_title') }</h2>
          <p>{ t('Empty.photos_text')}</p>
        </div>
      }
      {emptyType === 'albums' &&
        <div className={styles['pho-empty']}>
          <h2>{ t('Empty.albums_title') }</h2>
          <p>{ t('Empty.albums_text')}</p>
        </div>
      }
    </div>
  )
}

export default translate()(Empty)
