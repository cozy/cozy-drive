import React, { useCallback } from 'react'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Magnifier from 'cozy-ui/transpiled/react/Icons/Magnifier'

const SearchButton = ({ router, t }) => {
  const goToSearch = useCallback(() => {
    router.push(`/search?returnPath=${router.location.pathname}`)
  }, [router])

  return (
    <IconButton onClick={goToSearch} aria-label={t('search.action')}>
      <Icon icon={Magnifier} />
    </IconButton>
  )
}

export default SearchButton
