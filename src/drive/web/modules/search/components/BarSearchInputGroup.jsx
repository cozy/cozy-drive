import React from 'react'

import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Magnifier from 'cozy-ui/transpiled/react/Icons/Magnifier'
import CrossCircleOutlineIcon from 'cozy-ui/transpiled/react/Icons/CrossCircleOutline'

import styles from 'drive/web/modules/search/components/styles.styl'

const BarSearchInputGroup = ({
  children,
  isMobile,
  onClean,
  isInputNotEmpty
}) => {
  return (
    <InputGroup
      fullwidth={true}
      className={styles['bar-search-input-group']}
      prepend={
        !isMobile ? (
          <Icon
            icon={Magnifier}
            className={styles['bar-search-input-group-append']}
            aria-hidden="true"
          />
        ) : null
      }
      append={
        isInputNotEmpty ? (
          <IconButton size="medium" onClick={onClean}>
            <Icon icon={CrossCircleOutlineIcon} />
          </IconButton>
        ) : null
      }
    >
      {children}
    </InputGroup>
  )
}

export default BarSearchInputGroup
