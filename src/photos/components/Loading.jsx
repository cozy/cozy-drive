import React from 'react'
import classNames from 'classnames'

import { translate } from 'cozy-ui/react/I18n'
import { Spinner } from 'cozy-ui/react'
import palette from 'cozy-ui/react/palette'

import styles from '../styles/loading'

export const Loading = ({
  size = 'xxlarge',
  loadingType,
  noMargin = false,
  middle = true
}) => {
  return (
    <div data-test-id="loading" className={classNames(styles['pho-loading'])}>
      <Spinner
        size={size}
        loadingType={loadingType}
        color={palette.dodgerBlue}
        noMargin={noMargin}
        middle={middle}
      />
    </div>
  )
}

export default translate()(Loading)
