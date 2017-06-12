import styles from '../styles/loading'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

export const Loading = ({ t, loadingType, noMargin }) => {
  return (
    <div
      className={noMargin
        ? styles['pho-loading--no-margin']
        : styles['pho-loading']
      }
    >
      {loadingType && <p>{t(`Loading.${loadingType}`)}</p>}
    </div>
  )
}

export default translate()(Loading)
