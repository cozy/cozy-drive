import React from 'react'

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
  onClean,
  isInputNotEmpty
}) => {
  return (
    <InputGroup
      fullwidth={true}
      className={styles['bar-search-input-group']}
      prepend={
        isBusy ? (
          <Icon icon={Spinner} color="#297EF2" spin />
        ) : (
          <Icon icon={Magnifier} color="#95999D" />
        )
      }
      append={
        isInputNotEmpty ? (
          <IconButton size="medium" onClick={onClean}>
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
