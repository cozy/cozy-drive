import React from 'react'
import cx from 'classnames'

import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Magnifier from 'cozy-ui/transpiled/react/Icons/Magnifier'
import Spinner from 'cozy-ui/transpiled/react/Icons/Spinner'

import styles from 'drive/web/modules/search/components/styles.styl'

const BarSearchInputGroup = ({ children, isBusy, isFocus }) => {
  return (
    <InputGroup
      fullwidth={true}
      className={cx(
        styles['bar-search-input-group'],
        isFocus ? styles['--focused'] : ''
      )}
      prepend={
        isBusy ? (
          <Icon icon={Spinner} color="#297EF2" spin />
        ) : (
          <Icon icon={Magnifier} color="#95999D" />
        )
      }
    >
      {children}
    </InputGroup>
  )
}

export default BarSearchInputGroup
