import React from 'react'
import cx from 'classnames'

import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Magnifier from 'cozy-ui/transpiled/react/Icons/Magnifier'
import Spinner from 'cozy-ui/transpiled/react/Icons/Spinner'
import CrossCircleIcon from 'cozy-ui/transpiled/react/Icons/CrossCircle'

import styles from 'drive/web/modules/search/components/styles.styl'

const BarSearchInputGroup = ({
  children,
  isBusy,
  isFocus,
  onClean,
  isInputNotEmpty
}) => {
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
      append={
        isInputNotEmpty ? (
          <IconButton
            size="medium"
            onClick={onClean}
            className={styles['bar-search-input-group-clean-button']}
          >
            <Icon icon={CrossCircleIcon} />
          </IconButton>
        ) : null
      }
    >
      {children}
    </InputGroup>
  )
}

export default BarSearchInputGroup
