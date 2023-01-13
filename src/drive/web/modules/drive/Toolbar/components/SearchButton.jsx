import React, { useCallback } from 'react'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Magnifier from 'cozy-ui/transpiled/react/Icons/Magnifier'

const SearchButton = ({ navigate, pathname, t }) => {
  const goToSearch = useCallback(() => {
    navigate(`/search?returnPath=${pathname}`)
  }, [navigate, pathname])

  return (
    <IconButton onClick={goToSearch} aria-label={t('search.action')}>
      <Icon icon={Magnifier} />
    </IconButton>
  )
}

export default SearchButton
