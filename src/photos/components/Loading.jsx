import React from 'react'
import classNames from 'classnames'

import { translate } from 'cozy-ui/react/I18n'
import { Spinner } from 'cozy-ui/react'

import styles from '../styles/loading'

export const Loading = ({
  size = 'xxlarge',
  loadingType,
  color,
  noMargin = false,
  middle = true
}) => {
  return (
    <div className={classNames(styles['pho-loading'])}>
      <Spinner
        size={size}
        loadingType={loadingType}
        color={color}
        noMargin={noMargin}
        middle={middle}
      />
    </div>
  )
}

export default translate()(Loading)
