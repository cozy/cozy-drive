import styles from '../styles/loading'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import classNames from 'classnames'

export const Loading = ({ t, loadingType, noMargin, color }) => {
  return (
    <div
      className={classNames(
        styles['pho-loading'], {
          [styles['pho-loading--no-margin']]: noMargin,
          [styles[`pho-loading--${color}`]]: color
        }
      )}
    >
      {loadingType && <p>{t(`Loading.${loadingType}`)}</p>}
    </div>
  )
}

export default translate()(Loading)
